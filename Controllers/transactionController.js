const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const Transaction = require('../Models/transactionModel');
const Account = require('../Models/accountModel');
const Category = require('../Models/categoryModel');

const getTransaction = asyncErrorHandler(async (req, res, next) => {
  const transactions = await req.user.getTransactions({
    attributes: ['amount', 'hasInstalment', 'instalmentQuantity', 'instalmentAmount', 'notes'],
    include: [Account, Category],
  });

  res.status(200).json({
    status: 'success',
    data: {
      transactions,
    },
  });
});

const createTransaction = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;

  const { amount, hasInstalment, instalmentQuantity, instalmentAmount, notes, accountId, categoryId } = req.body;

  // check if user has the account
  if (user.Accounts.find(item => item.id !== accountId)) {
    const error = new CustomError(400, 'account does not exists.');
    return next(error);
  }

  // check if user has the category
  if (user.Categories.find(item => item.id !== categoryId)) {
    const error = new CustomError(400, 'category does not exists.');
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
