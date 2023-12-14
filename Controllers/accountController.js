const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const prisma = require('../prisma/client');

const getAccount = asyncErrorHandler(async (req, res, next) => {
  const accountList = req.user.accounts;

  res.status(200).json({
    status: 'success',
    data: {
      accounts: accountList,
    },
  });
});

const createAccount = asyncErrorHandler(async (req, res, next) => {
  const { name, type, billingPeriod } = req.body;

  // get account lists
  const accountList = req.user.accounts;

  // 1 - check if account name already exists for the user
  if (accountList.find(item => item.name === name)) {
    const error = new CustomError(400, 'account name already exists.');
    return next(error);
  }

  // create account
  const newAccount = await prisma.account.create({
    data: {
      name,
      type,
      billingPeriod,
      user: {
        connect: {
          id: req.user.id,
        },
      },
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      account: newAccount,
    },
  });
});

const updateAccount = asyncErrorHandler(async (req, res, next) => {
  let { name, type, billingPeriod } = req.body;

  // 1- check if body has fields to update
  if (!name && !type && !billingPeriod) {
    const error = new CustomError(400, 'must provide a field to update');
    return next(error);
  }

  // check if name is already present in db
  if (name) {
    const accountList = req.user.accounts;

    if (accountList.find(item => item.name === name)) {
      const error = new CustomError(400, 'account name already exists.');
      return next(error);
    }
  }

  // 2- check if billingPeriod is present, if so, cast to integer
  if (billingPeriod) {
    billingPeriod = Number(billingPeriod);
  }

  // update account or thrown a NotFound error
  const accountForUpdate = await prisma.account.update({
    where: {
      id: req.params?.id || null,
      userId: req.user.id,
    },
    data: {
      name,
      type,
      billingPeriod,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      updated: accountForUpdate,
    },
  });
});

const deleteAccount = asyncErrorHandler(async (req, res, next) => {
  // get the account to eliminate
  await prisma.account.delete({
    where: {
      id: req.params?.id || null,
      userId: req.user.id,
    },
  });

  res.status(204).json({
    status: 'success',
  });
});

module.exports = {
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
};
