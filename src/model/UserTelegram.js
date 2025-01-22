const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const UserTelegram = db.define('user_telegram_spar12', {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  chatId: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  name: {
    allowNull: true,
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
  freezeTableName: true,
});

module.exports = { UserTelegram };
