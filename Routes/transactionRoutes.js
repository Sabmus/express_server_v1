const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/transactionController');
const { protect } = require('../Controllers/usersController');

router.route('/transaction').get(protect, transactionController.getTransaction);
router.route('/transaction').post(protect, transactionController.createTransaction);
router.route('/transaction/:id').patch(protect, transactionController.updateTransaction);
router.route('/transaction/:id').delete(protect, transactionController.deleteTransaction);

module.exports = router;
