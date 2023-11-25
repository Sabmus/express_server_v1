const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const Transaction = require('../Models/transactionModel');
const Account = require('../Models/accountModel');
const Category = require('../Models/categoryModel');

const createTransaction = asyncErrorHandler(async (req, res, next) => {
  const newTransaction = Transaction.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      transaction: newTransaction,
    },
  });
});

const createAccount = asyncErrorHandler(async (req, res, next) => {
  const newAccount = await Account.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      account: newAccount,
    },
  });
});

const createCategory = asyncErrorHandler(async (req, res, next) => {
  const newCategory = await Category.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});

module.exports = {
  createTransaction,
  createAccount,
  createCategory,
};
