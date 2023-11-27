const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const Category = require('../Models/categoryModel');

const getCategory = asyncErrorHandler(async (req, res, next) => {
  const categoryList = await req.user.getCategories({
    attributes: ['name'],
    raw: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      categories: categoryList,
    },
  });
});

const createCategory = asyncErrorHandler(async (req, res, next) => {
  // 1- check if category name already exists for the user
  const categoryList = await req.user.getCategories({
    attributes: ['name'],
    raw: true,
  });

  if (categoryList.find(item => item.name === req.body.name)) {
    const error = new CustomError(400, 'category name already exists.');
    return next(error);
  }

  const newCategory = await Category.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});

const updateCategory = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.name) {
    const error = new CustomError(400, 'you must provide a name');
    return next(error);
  }

  const categoryForUpdate = (
    await req.user.getCategories({
      where: {
        id: +req.params.id,
      },
    })
  )[0];

  console.log(categoryForUpdate);

  await categoryForUpdate.update({ name: req.body.name });

  res.status(200).json({
    status: 'success',
    data: {
      updated: categoryForUpdate,
    },
  });
});

const deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const categoryToDelete = (
    await req.user.getCategories({
      where: {
        id: +req.params.id,
      },
    })
  )[0];

  await categoryToDelete.destroy();

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
