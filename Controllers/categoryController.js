const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const prisma = require('../prisma/client');

const getCategory = asyncErrorHandler(async (req, res, next) => {
  const categoryList = req.user.categories;

  res.status(200).json({
    status: 'success',
    data: {
      categories: categoryList,
    },
  });
});

const createCategory = asyncErrorHandler(async (req, res, next) => {
  const name = req.body?.name || null;

  if (!name) {
    const error = new CustomError(401, 'must provide a name for category.');
    return next(error);
  }

  const categoryList = req.user.categories;

  // 1- check if category name already exists for the user
  if (categoryList.find(item => item.name === req.body.name)) {
    const error = new CustomError(400, 'category name already exists.');
    return next(error);
  }

  const newCategory = await prisma.category.create({
    data: {
      name,
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
      category: newCategory,
    },
  });
});

const updateCategory = asyncErrorHandler(async (req, res, next) => {
  const name = req.body?.name || null;

  if (!name) {
    const error = new CustomError(400, 'you must provide a name.');
    return next(error);
  }
  const categoryList = req.user.categories;

  if (categoryList.find(item => item.name === name)) {
    const error = new CustomError(400, 'category name already exists.');
    return next(error);
  }

  // get category to update
  const categoryForUpdate = await prisma.category.update({
    where: {
      id: req.params?.id || null,
      userId: req.user.id,
    },
    data: {
      name,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      updated: categoryForUpdate,
    },
  });
});

const deleteCategory = asyncErrorHandler(async (req, res, next) => {
  // get category to delete
  await prisma.category.delete({
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
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
