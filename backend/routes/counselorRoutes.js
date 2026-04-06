const express = require('express');
const router = express.Router();
const { addSlots, getCounselorBookings, updateBookingStatus, addSessionNote, updateProfile } = require('../controllers/counselorController');
const { protect, counselor } = require('../middleware/authMiddleware');

router.post('/slots', protect, counselor, addSlots);
router.get('/bookings', protect, counselor, getCounselorBookings);
router.put('/bookings/:id', protect, counselor, updateBookingStatus);
router.post('/notes', protect, counselor, addSessionNote);
router.put('/profile', protect, counselor, updateProfile); // New Route

module.exports = router;
