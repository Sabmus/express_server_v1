const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const Transaction = require('../Models/transactionModel');

const createTransaction = asyncErrorHandler(async (req, res, next) => {
  const newTransaction = Transaction.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      transaction: newTransaction,
    },
  });
});

module.exports = {
  createTransaction,
};
