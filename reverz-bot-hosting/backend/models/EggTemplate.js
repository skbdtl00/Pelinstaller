const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EggTemplate = sequelize.define('EggTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  runtime_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  egg_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  egg_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'egg_templates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = EggTemplate;
