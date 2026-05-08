const { Sequelize } = require('sequelize');
require('dotenv').config();

const useSSL = String(process.env.DB_SSL || '').toLowerCase() === 'true';
const dialectOptions = useSSL
  ? { ssl: { require: true, rejectUnauthorized: false } }
  : {};

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'optica_products',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions,
    }
  );
}

module.exports = sequelize;
