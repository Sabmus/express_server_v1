const express = require('express');
const router = express.Router();
const accountController = require('../Controllers/accountController');
const { protect } = require('../Controllers/usersController');

router.route('/account').get(protect, accountController.getAccount);
router.route('/account').post(protect, accountController.createAccount);
router.route('/account/:id').delete(protect, accountController.deleteAccount);

module.exports = router;
