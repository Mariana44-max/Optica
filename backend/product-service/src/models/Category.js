const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define(
  'Category',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(80), unique: true, allowNull: false },
  },
  { tableName: 'categories', timestamps: false }
);

module.exports = Category;
