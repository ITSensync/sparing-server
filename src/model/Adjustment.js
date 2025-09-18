// eslint-disable-next-line import/no-extraneous-dependencies
const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const Adjustment = db.define('adjustment', {
  id: {
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    type: DataTypes.UUID,
  },
  position: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  type: {
    allowNull: false,
    type: DataTypes.ENUM,
    values: ['init', 'condition'],
  },
  sensor_name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  condition: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  operation: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  min: {
    allowNull: true,
    type: DataTypes.FLOAT,
  },
  max: {
    allowNull: true,
    type: DataTypes.FLOAT,
  },
  factor: {
    allowNull: true,
    type: DataTypes.FLOAT,
  },
  offset: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  new_value: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  status: {
    allowNull: false,
    type: DataTypes.ENUM,
    defaultValue: 'enable',
    values: ['enable', 'disable'],
  },
  id_device: {
    allowNull: false,
    type: DataTypes.CHAR(25),
  },
}, {
  timestamps: false,
  freezeTableName: true,
});

module.exports = Adjustment;
