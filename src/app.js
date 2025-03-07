const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cron = require('node-cron');
const sequelize = require('./config/db.config');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');
const { WaterQuality } = require('./model/WaterQuality');
const { UserTelegram } = require('./model/UserTelegram');
const cronJob = require('./scheduler/cron-job');
const { Device } = require('./model/Device');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

(async () => {
  try {
    await sequelize.authenticate();
    // WaterQuality.sync({ alter: true });
    UserTelegram.sync();
    // Device.sync({ alter: true });
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

app.use('/api/server', api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// cron check-connection
cron.schedule('*/60 * * * * *', async () => {
  // check connection and send notification if no internet every 30 s
  cronJob.noInternetNotification();
});

module.exports = app;
