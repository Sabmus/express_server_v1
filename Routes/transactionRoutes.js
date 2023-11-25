const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/transactionController');
const { protect } = require('../Controllers/usersController');

router.route('/transaction').post(protect, transactionController.createTransaction);
router.route('/account').post(protect, transactionController.createAccount);
router.route('/category').post(protect, transactionController.createCategory);

module.exports = router;
