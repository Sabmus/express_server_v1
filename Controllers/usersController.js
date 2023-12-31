const User = require('../Models/userModel');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');
const { checkPassword } = require('../utils/hash');
const util = require('util');
const sendEmail = require('../utils/email');
const constants = require('../utils/constants');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password are present in the body of request
  if (!email || !password) {
    const error = new CustomError(400, 'email and passworod must be provided');
    return next(error);
  }

  //check if user exists in db
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = new CustomError(400, 'invalid email or password');
    return next(error);
  }

  //check if password is correct
  const correctPassword = await checkPassword(password, user.password);

  if (!correctPassword) {
    const error = new CustomError(400, 'invalid email or password');
    return next(error);
  }

  const token = signToken(user._id);

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
  const payload = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3. check if user exists
  const user = await User.findById(payload.id);

  if (!user) {
    const error = new CustomError(401, 'you must log in to see this.');
    return next(error);
  }

  // 4. check if user changed password after the token was issued
  const isPasswordChanged = await user.isPasswordChanged(payload.iat);
  if (isPasswordChanged) {
    const error = new CustomError(
      401,
      'password changed, please log in again.'
    );
    return next(error);
  }

  // 5. allow user to access
  req.user = user;
  next();
});

const onlyAdmin = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new CustomError(403, 'you do not have access.');
      return next(error);
    }

    next();
  };
};

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/${
      constants.user_api
    }/reset-password/${resetToken}`;

    const message = `please use the link below to reset your password\n\n${resetUrl}\n\nThis link will be valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'password reset',
        message,
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      user.save({ validateBeforeSave: false });

      return next(
        new CustomError(
          500,
          'there was a problem sending the password reset email'
        )
      );
    }
  }

  res.status(200).json({
    status: 'success',
    message:
      'if the email exists in the system, it will receive a reset password link.',
  });
};

const resetPassword = async (req, res, next) => {
  const token = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // check that password and password confirm are present in request body
  if (!req.body.password || !req.body.confirmPassword) {
    const error = new CustomError(
      400,
      'password and password confirm are required fields.'
    );
    return next(error);
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gte: Date.now() },
  });

  //check if user exsits
  if (!user) {
    const error = new CustomError(400, 'Invalid token or expired.');
    return next(error);
  }

  // save password to db (it will be hashed pre save)
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  user.save();

  // log the user in
  const jwtToken = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token: jwtToken,
  });
};

module.exports = {
  signup,
  login,
  protect,
  onlyAdmin,
  forgotPassword,
  resetPassword,
};
