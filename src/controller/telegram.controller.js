const telegramService = require('../services/telegram.service');

async function sendTelegramNotification(req, res) {
  const result = await telegramService.sendNotification('TES PESAN', '954421338');
  res.status(result.status).send(result);
}

async function saveTelegramChatId(req, res) {
  const result = await telegramService.saveChatId();
  res.status(result.status).send(result);
}

async function getBotData(req, res) {
  const result = await telegramService.getBotMessage();
  res.status(result.status).send(result);
}

async function getAllUser(req, res) {
  const result = await telegramService.getAll();
  res.status(result.status).send(result);
}

module.exports = {
  sendTelegramNotification,
  saveTelegramChatId,
  getBotData,
  getAllUser,
};
