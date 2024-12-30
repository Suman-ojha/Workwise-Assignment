const { Validator } = require('node-input-validator')
const { Seat } = require('../models/association')


module.exports = {
    get_all_seats: async function (req, res, next) {
        try {
            // Fetch all seats from the 'Seats' table, sorted by seat_number and row_number
            const seats = await Seat.findAll({
                order: [
                    ['seat_number', 'ASC'], // Sorting by seat_number in ascending order
                    ['row_number', 'ASC']   // Sorting by row_number in ascending order
                ]
            });

            return res.status(200).json({
                status: "success",
                seats
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: error?.message ?? 'something went wrong'
            });
        }
    },

    reset_reservation: async function (req, res, next) {
        try {
            const authId = req.authId; // Assuming req.authId contains the authenticated user's ID

            // Update seats reserved by the authenticated user
            const result = await Seat.update(
                { is_reserved: false, reserved_by: null }, // Resetting the reservation fields
                {
                    where: { reserved_by: authId } // Only update seats reserved by this user
                }
            );

            // Respond with success message
            return res.status(200).send({
                status: "success",
                message: "All your reserved seats are now available for booking.",
                reserve_seats: result[0], // Sequelize returns the number of affected rows in an array
            });
        } catch (error) {
            // Handle any errors
            return res.status(500).send({
                status: 'error',
                message: error?.message ?? 'Something went wrong'
            });
        }
    }
}