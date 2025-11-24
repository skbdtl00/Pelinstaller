const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ApiConfig = sequelize.define('ApiConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pelican_base_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  pelican_api_key: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  default_node_id: {
    type: DataTypes.INTEGER
  },
  queue_delay: {
    type: DataTypes.INTEGER,
    defaultValue: 5000,
    comment: 'Delay in milliseconds'
  },
  webhook_url: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'api_config',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ApiConfig;
