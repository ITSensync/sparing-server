const express = require('express');
const userController = require('../controller/user.controller');

const router = express.Router();

router.post('/login', userController.login);

module.exports = router;
