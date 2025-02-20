/* eslint-disable import/no-extraneous-dependencies */
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: process.env.NODE_ENV === 'development',
});

module.exports = db;
