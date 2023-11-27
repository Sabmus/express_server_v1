const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/categoryController');
const { protect } = require('../Controllers/usersController');

router.route('/category').get(protect, categoryController.getCategory);
router.route('/category').post(protect, categoryController.createCategory);
router.route('/category/:id').patch(protect, categoryController.updateCategory);
router.route('/category/:id').delete(protect, categoryController.deleteCategory);

module.exports = router;
