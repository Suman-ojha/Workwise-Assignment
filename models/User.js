const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_connection');

const User = sequelize.define(
  'User',
  {
    user_id: {
      type: DataTypes.UUID, // Use UUID for unique identification
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true } // Enables `createdAt` and `updatedAt` columns
);

module.exports = User;
