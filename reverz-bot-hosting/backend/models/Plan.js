const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Plan = sequelize.define('Plan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cpu: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'CPU in vCore'
  },
  ram: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'RAM in MB'
  },
  disk: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Disk space in MB'
  },
  allowed_runtimes: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: []
  },
  max_servers: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  visibility: {
    type: DataTypes.STRING(50),
    defaultValue: 'public',
    validate: {
      isIn: [['public', 'hidden']]
    }
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: []
  }
}, {
  tableName: 'plans',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Plan;
