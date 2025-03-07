// eslint-disable-next-line import/no-extraneous-dependencies
const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const Device = db.define('device_tbl', {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  id_device: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
  },
  last_update: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  tempat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cod: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  tss: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  nh3n: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  debit: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  debit2: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status_check: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  umpanbalik: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = {
  Device,
};
