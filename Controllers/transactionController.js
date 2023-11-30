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
  const { amount, hasInstalment, instalmentQuantity, instalmentAmount, notes, accountId, categoryId } = req.body;

  // check if user has the account and the category
  if (!req.user.account.includes(accountId) || !req.user.category.includes(categoryId)) {
    const error = new CustomError(400, 'account or category does not exists');
    return next(error);
  }

  // create the transaction
  const newTransaction = await Transaction.create({
    amount,
    hasInstalment,
    instalmentQuantity,
    instalmentAmount,
    notes,
    AccountId: accountId,
    CategoryId: categoryId,
    UserId: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    data: {
      transaction: newTransaction,
    },
  });
});

const updateTransaction = asyncErrorHandler(async (req, res, next) => {
  const { amount, hasInstalment, instalmentQuantity, instalmentAmount, notes } = req.body;

  // get transaction
  const transactionForUpdate = (
    await req.user.getTransactions({
      where: {
        id: +req.params.id,
      },
    })
  )[0];

  // check if transaction exists
  if (!transactionForUpdate) {
    const error = new CustomError(400, 'transaction does not exists.');
    return next(error);
  }

  // update transaction
  await transactionForUpdate.update({ amount, hasInstalment, instalmentQuantity, instalmentAmount, notes });

  res.status(200).json({
    status: 'success',
    data: {
      transaction: transactionForUpdate,
    },
  });
});

const deleteTransaction = asyncErrorHandler(async (req, res, next) => {
  // get transaction
  const transactionForDelete = (
    await req.user.getTransactions({
      where: {
        id: +req.params.id,
      },
    })
  )[0];

  // check if transaction exists
  if (!transactionForDelete) {
    const error = new CustomError(400, 'transaction does not exists.');
    return next(error);
  }

  // delete transaction
  await transactionForDelete.destroy();

  res.status(204).json({
    status: 'success',
  });
});

module.exports = {
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
