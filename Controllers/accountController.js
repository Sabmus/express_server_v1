const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const Account = require('../Models/accountModel');

const getAccount = asyncErrorHandler(async (req, res, next) => {
  const accountList = await req.user.getAccounts({
    attributes: ['name', 'type', 'billingPeriod'],
    raw: true,
  });

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
  const accountList = await req.user.getAccounts({
    attributes: ['name'],
    raw: true,
  });

  // 1 - check if account name already exists for the user
  if (accountList.find(item => item.name === name)) {
    const error = new CustomError(400, 'account name already exists.');
    return next(error);
  }

  // create account
  const newAccount = await Account.create({ name, type, billingPeriod, UserId: req.user.id });

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

  // 2- check if billingPeriod is present, if so, cast to integer
  if (billingPeriod) {
    billingPeriod = +billingPeriod;
  }

  // get account to update
  const accountForUpdate = (
    await req.user.getAccounts({
      where: {
        id: +req.params.id,
      },
    })
  )[0];

  // validate that the account exists
  if (!accountForUpdate) {
    const error = new CustomError(400, 'there is no account to update.');
    return next(error);
  }

  // update account
  await accountForUpdate.update({ name, type, billingPeriod });

  res.status(200).json({
    status: 'success',
    data: {
      updated: accountForUpdate,
    },
  });
});

const deleteAccount = asyncErrorHandler(async (req, res, next) => {
  // get the account to eliminate
  const accountToDelete = (
    await req.user.getAccounts({
      where: {
        id: +req.params.id,
      },
    })
  )[0];

  // check if account exists
  if (!accountToDelete) {
    const error = new CustomError(400, 'no account to delete.');
    return next(error);
  }

  // delete account
  await accountToDelete.destroy();

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
