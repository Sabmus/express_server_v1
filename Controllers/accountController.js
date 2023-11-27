const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const Account = require('../Models/accountModel');

const getAccount = asyncErrorHandler(async (req, res, next) => {
  const accountList = await req.user.getAccounts({
    attributes: ['name'],
    raw: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      accountList,
    },
  });
});

const createAccount = asyncErrorHandler(async (req, res, next) => {
  // 1- check if account name already exists for the user
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

const deleteAccount = asyncErrorHandler(async (req, res, next) => {
  const accountToDelete = await req.user.getAccounts({
    where: {
      id: +req.params.id,
    },
  });
  console.log(accountToDelete[0]);
  await req.user.removeAccount(accountToDelete[0]);

  res.status(204).json({
    status: 'success',
  });
});

module.exports = {
  createAccount,
  getAccount,
  deleteAccount,
};