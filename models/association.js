const User = require('./User');
const Seat = require('./Seat');
const sequelize = require('../config/db_connection');

// Define associations
User.hasMany(Seat, {
  foreignKey: 'reserved_by',
  as: 'reservedSeats',
});

Seat.belongsTo(User, {
  foreignKey: 'reserved_by',
  as: 'reservedBy',
});

module.exports = { User, Seat , sequelize };
