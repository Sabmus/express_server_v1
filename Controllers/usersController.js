const asyncErrorHandler = require('../utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');
const ErrorNames = require('../utils/customErrorNames');
const util = require('util');
const { hashPassword, checkPassword } = require('../utils/hash');
const sendEmail = require('../utils/email');
const constants = require('../utils/constants');
const crypto = require('crypto');
const prisma = require('../prisma/client');
const validator = require('validator');

const minutes = 10;
const tenMinutes = minutes * 60 * 1000;

const createTokenUrl = (req, path, token) => {
  return `${req.protocol}://${req.get('host')}${constants.userApi}/${path}/${token}`;
};

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const signup = asyncErrorHandler(async (req, res, next) => {
  const { email, name, lastName, password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    const error = new CustomError(400, 'password and confim password must be provided.');
    return next(error);
  }

  if (!(password === confirmPassword)) {
    const error = new CustomError(400, 'passwords does not match.');
    return next(error);
  }

  if (!validator.isEmail(email)) {
    const error = new CustomError(400, 'invalid email.');
    return next(error);
  }

  // create activation account email parameters
  const confirmationToken = crypto.randomBytes(32).toString('hex');
  const hashedConfirmationToken = crypto.createHash('sha256').update(confirmationToken).digest('hex');

  const resetUrl = createTokenUrl(req, 'confirm-account', confirmationToken);
  const message = `please use the link below to activate your account\n\n${resetUrl}\n\nThis link will be valid for ${minutes} minutes.`;

  // create user in db
  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      lastName,
      password: hashedPassword,
      confirmationToken: {
        create: {
          token: hashedConfirmationToken,
          validUntil: new Date(Date.now() + tenMinutes).toISOString(),
        },
      },
    },
    select: {
      email: true,
      name: true,
      lastName: true,
      accounts: {
        select: {
          name: true,
          type: true,
          billingPeriod: true,
        },
      },
    },
  });

  // send activation email
  await sendEmail({
    email: newUser.email,
    subject: 'account confirmation',
    message,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

const confirmAccount = asyncErrorHandler(async (req, res, next) => {
  const token = req.params?.token || '';
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  await prisma.confirmationToken.update({
    where: {
      token: hashedToken,
      validUntil: {
        gte: new Date().toISOString(),
      },
    },
    data: {
      // prisma enum: ConfirmationTokenStatus
      status: 'success',
      validUntil: new Date().toISOString(),
      confirmationDate: new Date().toISOString(),
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'account was succesfully confirmated.',
  });
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password are present in the body of request
  if (!email || !password) {
    const error = new CustomError(400, 'email and passworod must be provided');
    return next(error);
  }

  //check if user exists in db and has it account confirmed
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    const error = new CustomError(
      401,
      'user not found or confirmation token pending or failed',
      ErrorNames.user.notFound
    );
    return next(error);
  }

  //check if password is correct
  const correctPassword = await checkPassword(password, user.password);

  if (!correctPassword) {
    const error = new CustomError(400, 'invalid email or password');
    return next(error);
  }

  const token = signToken(user.email);

  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});

const protect = asyncErrorHandler(async (req, res, next) => {
  // 1. read the token and check if exists
  const testToken = req.headers.authorization;

  if (!(testToken && testToken.startsWith('Bearer'))) {
    const error = new CustomError(401, 'you must log in to see this.');
    return next(error);
  }

  const token = testToken.split(' ')[1];

  // 2. verify token
  const payload = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email: payload.id,
    },
    include: {
      accounts: true,
      categories: true,
    },
  });

  if (!user) {
    const error = new CustomError(401, 'you must log in to see this.', ErrorNames.user.notFound);
    return next(error);
  }

  // 4. check if user changed password after the token was issued
  /* const isPasswordChanged = user.isPasswordChanged(payload.iat);
  if (isPasswordChanged) {
    const error = new CustomError(401, 'password changed, please log in again.');
    return next(error);
  } */

  // 5. allow user to access
  req.user = user;
  next();
});

const onlyAdmin = role => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new CustomError(403, 'you do not have access.');
      return next(error);
    }

    next();
  };
};

const forgotPassword = async (req, res, next) => {
  const user = await prisma.user.findUnique({ where: { email: req.body?.email || '' } });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const expiresDate = new Date(Date.now() + tenMinutes).toISOString();

    await prisma.passwordReset.upsert({
      where: {
        userId: user.id,
      },
      update: {
        passwordResetToken,
        passwordResetTokenExpires: expiresDate,
      },
      create: {
        userId: user.id,
        passwordResetToken,
        passwordResetTokenExpires: expiresDate,
      },
    });

    const resetUrl = createTokenUrl(req, 'reset-password', resetToken);
    const message = `please use the link below to reset your password\n\n${resetUrl}\n\nThis link will be valid for ${minutes} minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'password reset',
        message,
      });
    } catch (error) {
      await prisma.passwordReset.update({
        where: {
          userId: user.id,
        },
        data: {
          passwordResetToken: null,
          passwordResetTokenExpires: null,
        },
      });
      return next(new CustomError(500, 'there was a problem sending the password reset email'));
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'if the email exists in the system, it will receive a reset password link.',
  });
};

const resetPassword = async (req, res, next) => {
  const token = req.params?.token || '';
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // check that password and password confirm are present in request body
  if (!req.body.password || !req.body.confirmPassword) {
    const error = new CustomError(400, 'password and password confirm are required fields.');
    return next(error);
  }

  const hashedPassword = await hashPassword(req.body.password);

  const user = await prisma.passwordReset.update({
    where: {
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { gte: new Date().toISOString() },
    },
    data: {
      passwordResetToken: null,
      passwordResetTokenExpires: null,
      user: {
        update: {
          data: {
            password: hashedPassword,
          },
        },
      },
    },
    include: {
      user: true,
    },
  });

  //check if user exsits
  if (!user) {
    const error = new CustomError(400, 'Invalid token or expired.');
    return next(error);
  }

  // log the user in
  //const jwtToken = signToken(user.id);

  res.status(200).json({
    status: 'success',
    //token: jwtToken,
  });
};

module.exports = {
  signup,
  confirmAccount,
  login,
  protect,
  onlyAdmin,
  forgotPassword,
  resetPassword,
};
