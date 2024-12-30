const seatController = require('../controllers/seatController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = require('express').Router();

router.get('/' , seatController.get_all_seats)
router.post('/reset' , authMiddleware.chechAuth , seatController.reset_reservation)
router.post('/reserve' , authMiddleware.chechAuth , seatController.seat_booking)

module.exports = router;