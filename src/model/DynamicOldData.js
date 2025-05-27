const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

function defineDynamicOldModel(tableName) {
  return db.define(tableName, {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    id_device: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: tableName,
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
    umpanbalik: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    freezeTableName: true, // Agar nama tabel tidak otomatis diubah oleh Sequelize
    timestamps: false,
  });
}

module.exports = defineDynamicOldModel;
