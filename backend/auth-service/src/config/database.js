const { Sequelize } = require('sequelize');
require('dotenv').config();

const useSSL = String(process.env.DB_SSL || '').toLowerCase() === 'true';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'optica_auth',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: useSSL
      ? { ssl: { rejectUnauthorized: false } }
      : {},
  }
);

module.exports = sequelize;
