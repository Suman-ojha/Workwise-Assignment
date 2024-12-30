const { Validator } = require('node-input-validator')
const { Seat } = require('../models/association')
const { sequelize } = require('../models/association')


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
                reset_seats_count: result[0], // Sequelize returns the number of affected rows in an array
            });
        } catch (error) {
            // Handle any errors
            return res.status(500).send({
                status: 'error',
                message: error?.message ?? 'Something went wrong'
            });
        }
    },
    // Assuming Seat is your Sequelize model and sequelize is your Sequelize instance

    seat_booking: async (req, res) => {
        const { numOfSeats } = req.body;

        if (numOfSeats > 7) {
            return res.status(400).json({ message: 'Not able to book more than 7 seats' });
        }

        const transaction = await sequelize.transaction(); // Start a transaction

        try {
            // Get available seats
            const availableSeats = await Seat.findAll({
                where: { is_reserved: false },
                order: [['row_number', 'ASC'], ['seat_number', 'ASC']],
                transaction
            });

            // If not enough seats available
            if (availableSeats.length < numOfSeats) {
                await transaction.rollback();
                return res.status(500).json({ message: `Booking failed, Only ${availableSeats.length} seats available to book.` });
            }

            const rowCount = 12;
            let bookedSeats = [];

            // Book seats in the same row if possible
            for (let row = 1; row <= rowCount; row++) {
                const rowSeats = availableSeats.filter(seat => seat.row_number === row);
                const falseCount = rowSeats.filter(seat => !seat.is_reserved).length;

                if (falseCount >= numOfSeats) {
                    bookedSeats = rowSeats.filter(seat => !seat.is_reserved).slice(0, numOfSeats);
                    for (let seat of bookedSeats) {
                        seat.is_reserved = true;
                        seat.reserved_by = req.authId; // Assuming authId is set in the request
                        await seat.save({ transaction });
                    }
                    await transaction.commit();
                    return res.status(200).json({ data: bookedSeats });
                }
            }

            // Book seats in nearby rows if not enough in the same row
            let arr = [];
            for (let row = 1; row <= rowCount; row++) {
                const rowSeats = availableSeats.filter(seat => seat.row_number === row);
                const falseCount = rowSeats.filter(seat => !seat.is_reserved).length;
                arr.push(falseCount);
            }

            let minLength = Infinity;
            let minStart = -1;
            let minEnd = -1;
            let start = 0;
            let end = 0;
            let sum = 0;

            // Find nearby rows
            while (end < arr.length) {
                sum += arr[end];
                while (sum >= numOfSeats) {
                    let length = end - start + 1;
                    if (length < minLength) {
                        minLength = length;
                        minStart = start;
                        minEnd = end;
                    }
                    sum -= arr[start];
                    start++;
                }
                end++;
            }

            // Final array to update
            let finalArray = [];
            for (let row = minStart + 1; row <= minEnd + 1; row++) {
                const rowSeats = availableSeats.filter(seat => seat.row_number === row);
                finalArray.push(...rowSeats.filter(seat => !seat.is_reserved));
            }
            finalArray = finalArray.slice(0, numOfSeats);

            // Update seats in nearby rows
            for (let seat of finalArray) {
                seat.is_reserved = true;
                seat.reserved_by = req.authId; // Assuming authId is set in the request
                await seat.save({ transaction });
            }

            // Commit the transaction if nearby seats booking is done
            await transaction.commit();
            if (finalArray)
                return res.status(200).json({ data: finalArray });
            // if booking failed
            return res.status(500).json({ message: 'Booking failed' });

        } catch (error) {
            await transaction.rollback();
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

}