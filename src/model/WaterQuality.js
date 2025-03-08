// eslint-disable-next-line import/no-extraneous-dependencies
const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const WaterQuality = db.define('sparing12', {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  ids: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'sparing12',
  },
  unixtime: {
    allowNull: false,
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  ph: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  cod: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  tss: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  nh3n: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  debit: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  debit2: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  status_1h: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  umpanbalik: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = {
  WaterQuality,
};
