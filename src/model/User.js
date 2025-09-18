// eslint-disable-next-line import/no-extraneous-dependencies
const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const User = db.define('user_tbl', {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  username: {
    allowNull: true,
    type: DataTypes.CHAR(100),
  },
  password: {
    allowNull: true,
    type: DataTypes.CHAR(255),
  },
  passdecrypt: {
    allowNull: true,
    type: DataTypes.CHAR(255),
  },
  id_device: {
    allowNull: true,
    type: DataTypes.CHAR(25),
  },
  last_login: {
    allowNull: true,
    type: DataTypes.DATE,
  },
}, {
  timestamps: false,
  freezeTableName: true,
});

module.exports = {
  User,
};
