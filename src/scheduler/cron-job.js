const telegramService = require('../services/telegram.service');
const waterQualityService = require('../services/waterQuality.service');

async function noInternetNotification() {
  console.log('CRON CHECK INTERNET START...');
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

    const targetDate = new Date(latestData.createdAt);

    // Mendapatkan waktu saat ini
    const currentDate = new Date();

    // Mendapatkan selisih waktu dalam milidetik
    const differenceInMillis = currentDate - targetDate;

    // Mengonversi milidetik ke menit
    const differenceInMinutes = Math.floor(differenceInMillis / (1000 * 60));

    if (differenceInMinutes > 10) {
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

module.exports = {
  noInternetNotification,
};
