const express = require('express');
const telegramController = require('../controller/telegram.controller');

const router = express.Router();

router.get('/', telegramController.getAllUser);
router.get('/bot', telegramController.getBotData);
router.post('/', telegramController.saveTelegramChatId);
router.get('/notification', telegramController.sendTelegramNotification);

module.exports = router;
