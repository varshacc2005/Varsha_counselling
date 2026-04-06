const express = require('express');
const router = express.Router();
const { getChat, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:bookingId', protect, getChat);
router.post('/:bookingId', protect, sendMessage);

module.exports = router;
