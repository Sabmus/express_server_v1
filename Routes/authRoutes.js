const express = require('express');
const router = express.Router();
const { signup } = require('../Controllers/usersController');

router.route('/signup').post(signup);

module.exports = router;
