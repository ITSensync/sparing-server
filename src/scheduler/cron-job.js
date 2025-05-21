const telegramService = require('../services/telegram.service');
const waterQualityService = require('../services/waterQuality.service');

async function noInternetNotification() {
  console.info('CRON CHECK INTERNET START...', new Date().toISOString());
  const teleAdminUser = await telegramService.getAll();

  if (!teleAdminUser) {
    console.error('FAILED TO FETCH SAVED TELEGRAM USER');
  }

  try {
    const resultLatest = await waterQualityService.getLatest();

    const latestData = resultLatest.data;
    if (!latestData) {
      throw new Error('No Latest data found!');
    }

    const targetDate = latestData.time;

    // Mendapatkan waktu saat ini
    const currentDate = new Date();
    const currentDateWIB = new Date(currentDate.getTime() + 7 * 60 * 60 * 1000);

    // Mendapatkan selisih waktu dalam milidetik
    const differenceInMillis = currentDateWIB - targetDate;

    // Mengonversi milidetik ke menit
    const differenceInMinutes = Math.floor(differenceInMillis / (1000 * 60));
    console.log(targetDate);
    console.log(currentDateWIB);
    console.log(differenceInMinutes);

    if (differenceInMinutes < 10) {
      console.log('Sparing Local Device Connected with Internet');
    } else {
      const message = 'No Internet Connection on Sparing Local Device';
      console.log(message);
      teleAdminUser.data.forEach(async (user) => {
        const { chatId } = user;
        await telegramService.sendNotification(message, chatId);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function saveUserTelegram() {
  try {
    await telegramService.saveChatId();
  } catch (error) {
    console.error('Save User Telegram Error:', error.message);
  }
}

module.exports = {
  noInternetNotification,
  saveUserTelegram,
};
