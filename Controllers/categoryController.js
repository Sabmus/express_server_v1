const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const Category = require('../Models/categoryModel');

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

module.exports = {
  createCategory,
};
