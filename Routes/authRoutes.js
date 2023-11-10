const express = require('express');
const router = express.Router();
const userController = require('../Controllers/usersController');

router.route('/signup').post(userController.signup);
router.route('/login').post(userController.login);
router.route('/forgot-password').post(userController.forgotPassword);
router.route('/reset-password/:token').patch(userController.resetPassword);

module.exports = router;
