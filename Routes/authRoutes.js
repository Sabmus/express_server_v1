const express = require('express');
const router = express.Router();
const userController = require('../Controllers/usersController');

router.route('/signup').post(userController.signup);
router.route('/login').post(userController.login);
router.route('/forgot-password').post(userController.forgotPassword);
router.route('/reset-password/:token').patch(userController.resetPassword);
router.route('/confirm-account/:token').patch(userController.confirmAccount);

module.exports = router;
