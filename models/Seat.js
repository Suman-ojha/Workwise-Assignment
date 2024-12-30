const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_connection');
const User = require('./User'); // Import User model for associations

const Seat = sequelize.define(
    'Seat',
    {
        seat_number: {
            type: DataTypes.INTEGER, // Use UUID for consistency
            allowNull: false, // Ensure it's required
            required: true
            // primaryKey: true,
        },
        row_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_reserved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        reserved_by: {
            type: DataTypes.UUID,
            references: {
                model: User, // Reference User model
                key: 'user_id',
            },
            allowNull: true,
            onDelete: 'SET NULL',
        },
    },
    { timestamps: true }
);

module.exports = Seat;
