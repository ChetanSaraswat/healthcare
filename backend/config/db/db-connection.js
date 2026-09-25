const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config.js')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    return true;
  } catch (error) {
    console.error(`Failed to connect to database: ${error.message || error}`);
    throw error;
  }
};

module.exports = {
  sequelize,
  checkConnection,
};
