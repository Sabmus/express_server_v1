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
  // 1- check if fields are present in req.body
  const { name, type, billingPeriod } = req.body;
  // 2- check if account name already exists for the user
  const accountList = await req.user.getAccounts({
    attributes: ['name'],
    raw: true,
  });
  if (accountList.find(item => item.name === req.body.name)) {
    const error = new CustomError(400, 'account name already exists.');
    return next(error);
  }

  const newAccount = await Account.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      account: newAccount,
    },
  });
});

const updateAccount = asyncErrorHandler(async (req, res, next) => {
  // 1- check if body has fields to update
  const { name, type, billingPeriod } = req.body;
  if (!name && !type && !billingPeriod) {
    const error = new CustomError(400, 'must provide a field to update');
    return next(error);
  }

  // 2- check if billingPeriod is present, if so, cast to integer
  if (billingPeriod) {
    req.body.billingPeriod = +req.body.billingPeriod;
  }

  const accountForUpdate = (
    await req.user.getAccounts({
      where: {
        id: +req.params.id,
      },
    })
  )[0];

  await accountForUpdate.update(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      updated: accountForUpdate,
    },
  });
});

const deleteAccount = asyncErrorHandler(async (req, res, next) => {
  const accountToDelete = (
    await req.user.getAccounts({
      where: {
        id: +req.params.id,
      },
    })
  )[0];

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
