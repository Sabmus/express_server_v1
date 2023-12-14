const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const prisma = require('../prisma/client');

const getTransaction = asyncErrorHandler(async (req, res, next) => {
  const transactions = req.user.transactions;

  res.status(200).json({
    status: 'success',
    data: {
      transactions,
    },
  });
});

const createTransaction = asyncErrorHandler(async (req, res, next) => {
  const { amount, hasInstalment, instalmentQuantity, instalmentAmount, notes, accountId, categoryId } = req.body;

  const accountList = req.user.accounts;
  const categoryList = req.user.categories;

  // check if user has the account
  if (!accountList.some(item => item.id === accountId)) {
    const error = new CustomError(400, 'account does not exists.');
    return next(error);
  }

  // check if user has the category
  if (!categoryList.some(item => item.id === categoryId)) {
    const error = new CustomError(400, 'category does not exists.');
    return next(error);
  }

  // create the transaction
  const newTransaction = await prisma.transaction.create({
    data: {
      amount,
      hasInstalment,
      instalmentQuantity,
      instalmentAmount,
      notes,
      user: {
        connect: {
          id: req.user.id,
        },
      },
      account: {
        connect: {
          id: accountId,
        },
      },
      category: {
        connect: {
          id: categoryId,
        },
      },
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      transaction: newTransaction,
    },
  });
});

const updateTransaction = asyncErrorHandler(async (req, res, next) => {
  const { amount, hasInstalment, instalmentQuantity, instalmentAmount, notes, accountId, categoryId } = req.body;

  const accountList = req.user.accounts;
  const categoryList = req.user.categories;

  if (accountId) {
    // check if user has the account
    if (!accountList.some(item => item.id === accountId)) {
      const error = new CustomError(400, 'account does not exists.');
      return next(error);
    }
  }

  if (categoryId) {
    // check if user has the category
    if (!categoryList.some(item => item.id === categoryId)) {
      const error = new CustomError(400, 'category does not exists.');
      return next(error);
    }
  }

  // update transaction
  const transactionForUpdate = await prisma.transaction.update({
    where: {
      id: req.params?.id || null,
      userId: req.user.id,
    },
    data: {
      amount,
      hasInstalment,
      instalmentQuantity,
      instalmentAmount,
      notes,
      accountId,
      categoryId,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      transaction: transactionForUpdate,
    },
  });
});

const deleteTransaction = asyncErrorHandler(async (req, res, next) => {
  // get transaction
  await prisma.transaction.delete({
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
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
