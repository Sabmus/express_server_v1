const express = require('express');
const router = express.Router();
const accountController = require('../Controllers/accountController');
const { protect } = require('../Controllers/usersController');

router.route('/account').get(protect, accountController.getAccount);
router.route('/account').post(protect, accountController.createAccount);

module.exports = router;
