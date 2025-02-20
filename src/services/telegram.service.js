/* eslint-disable no-await-in-loop */
const { default: axios } = require('axios');
const { UserTelegram } = require('../model/UserTelegram');

async function getBotMessage() {
  try {
    const botData = await axios.get(`https://api.telegram.org/bot${process.env.BOT_SECRET_TOKEN}/getupdates`);
    return {
      status: 200,
      data: botData.data,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

async function sendNotification(message, chatId) {
  try {
    const url = `https://api.telegram.org/bot${process.env.BOT_SECRET_TOKEN}/sendMessage?parse_mode=html&chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        status: 500,
        message: 'Pesan Gagal Terkirim',
        error,
      };
    }

    return {
      status: 200,
      message: 'Pesan Berhasil Terkirim',
    };
  } catch (error) {
    return {
      status: 500,
      message: 'Pesan Gagal Terkirim',
      error: error.message,
    };
  }
}

async function getAll() {
  try {
    const response = await UserTelegram.findAll();
    return {
      status: 200,
      message: 'GET USER TELEGRAM SUCCESS',
      data: response,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'GET USER TELEGRAM ERROR',
      error: error.message,
    };
  }
}

async function saveChatId() {
  try {
    const botData = await getBotMessage();
    const messageData = botData.data.result;
    const results = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const data of messageData) {
      const chatId = data.message.chat.id;
      const name = data.message.from.first_name;

      const existingUser = await UserTelegram.findOne({ where: { chatId } });

      if (!existingUser) {
        const userData = await UserTelegram.create({ name, chatId });

        if (!userData) {
          throw new Error('CANNOT INSERT USER TELEGRAM DATA');
        }
        results.push(`Add user with name ${name} successful!`);
      } else {
        results.push(`User with name:${name} already exists!`);
      }
    }

    return {
      status: 200,
      data: results,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

module.exports = {
  getBotMessage,
  sendNotification,
  saveChatId,
  getAll,
};
