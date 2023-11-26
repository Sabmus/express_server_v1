const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/categoryController');
const { protect } = require('../Controllers/usersController');

router.route('/category').post(protect, categoryController.createCategory);

module.exports = router;
