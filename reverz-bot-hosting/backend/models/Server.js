const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Server = sequelize.define('Server', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  plan_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'plans',
      key: 'id'
    }
  },
  pelican_server_id: {
    type: DataTypes.INTEGER,
    comment: 'Server ID from Pelican Panel'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  runtime: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'nodejs, python, etc'
  },
  egg_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  egg_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'suspended', 'deleted']]
    }
  },
  expires_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'servers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Server;
