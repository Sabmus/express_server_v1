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
  const name = req.body.name;

  const categoryList = await req.user.getCategories({
    attributes: ['name'],
    raw: true,
  });

  // 1- check if category name already exists for the user
  if (categoryList.find(item => item.name === req.body.name)) {
    const error = new CustomError(400, 'category name already exists.');
    return next(error);
  }

  const newCategory = await Category.create({ name, UserId: req.user.id });

  res.status(200).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});

const updateCategory = asyncErrorHandler(async (req, res, next) => {
  const name = req.body.name;

  if (!name) {
    const error = new CustomError(400, 'you must provide a name.');
    return next(error);
  }

  // get category to update
  const categoryForUpdate = (
    await req.user.getCategories({
      where: {
        id: +req.params.id,
      },
    })
  )[0];

  // check if category exists
  if (!categoryForUpdate) {
    const error = new CustomError(400, 'there is no category to update.');
    return next(error);
  }

  // update the category
  await categoryForUpdate.update({ name });

  res.status(200).json({
    status: 'success',
    data: {
      updated: categoryForUpdate,
    },
  });
});

const deleteCategory = asyncErrorHandler(async (req, res, next) => {
  // get category to delete
  const categoryToDelete = (
    await req.user.getCategories({
      where: {
        id: +req.params.id,
      },
    })
  )[0];

  if (!categoryToDelete) {
    const error = new CustomError(400, 'there is no category to delete.');
    return next(error);
  }

  // delete category
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
