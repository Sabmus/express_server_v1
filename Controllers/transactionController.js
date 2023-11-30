const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const Transaction = require('../Models/transactionModel');

const getTransaction = asyncErrorHandler(async (req, res, next) => {
  const transactions = await req.user.getTransactions();

  res.status(200).json({
    status: 'success',
    data: {
      transactions,
    },
  });
});

const createTransaction = asyncErrorHandler(async (req, res, next) => {
  const newTransaction = await Transaction.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      transaction: newTransaction,
    },
  });
});

const updateTransaction = asyncErrorHandler(async (req, res, next) => {
  const transactionForUpdate = (
    await req.user.getTransactions({
      where: {
        id: +req.params.id,
      },
    })
  )[0];
});

module.exports = {
  getTransaction,
  createTransaction,
  updateTransaction,
};
