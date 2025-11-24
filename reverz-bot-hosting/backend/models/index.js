const sequelize = require('../config/database');
const User = require('./User');
const Plan = require('./Plan');
const Server = require('./Server');
const ApiConfig = require('./ApiConfig');
const EggTemplate = require('./EggTemplate');

// Define relationships
User.hasMany(Server, { foreignKey: 'user_id', as: 'servers' });
Server.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Plan.hasMany(Server, { foreignKey: 'plan_id', as: 'servers' });
Server.belongsTo(Plan, { foreignKey: 'plan_id', as: 'plan' });

module.exports = {
  sequelize,
  User,
  Plan,
  Server,
  ApiConfig,
  EggTemplate
};
