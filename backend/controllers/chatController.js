const Chat = require('../models/Chat');
const Booking = require('../models/Booking');

// @desc    Get chat messages for a booking
// @route   GET /api/chat/:bookingId
// @access  Private (Student assigned to booking OR Counselor assigned to booking)
const getChat = async (req, res) => {
    const bookingId = req.params.bookingId;

    // Authorization check
    // We need to fetch booking to see if user is part of it.
    // Or we can just findOne chat where booking matches and check access?
    // Better to check booking first.
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        res.status(404).json({ message: 'Booking not found' });
        return;
    }

    if (booking.studentId.toString() !== req.user._id.toString() &&
        booking.counselorId.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'Not authorized for this chat' });
        return;
    }

    let chat = await Chat.findOne({ bookingId });
    if (!chat) {
        // If no chat exists yet, return empty messages or create one?
        // Let's return empty array.
        return res.json([]);
    }

    res.json(chat.messages);
};

// @desc    Send a message
// @route   POST /api/chat/:bookingId
// @access  Private
const sendMessage = async (req, res) => {
    const bookingId = req.params.bookingId;
    const { message } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        res.status(404).json({ message: 'Booking not found' });
        return;
    }

    // Authorization
    let senderRole;
    if (booking.studentId.toString() === req.user._id.toString()) {
        senderRole = 'student';
    } else if (booking.counselorId.toString() === req.user._id.toString()) {
        senderRole = 'counselor';
    } else {
        res.status(401).json({ message: 'Not authorized for this chat' });
        return;
    }

    // Only allow chat if booking is approved
    if (booking.status !== 'approved') {
        res.status(400).json({ message: 'Chat is only enabled for approved sessions' });
        return;
    }

    let chat = await Chat.findOne({ bookingId });

    if (!chat) {
        chat = await Chat.create({
            bookingId,
            messages: [],
        });
    }

    const newMessage = {
        senderId: req.user._id,
        senderRole,
        message,
        timestamp: Date.now(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(201).json(chat.messages);
};

module.exports = {
    getChat,
    sendMessage,
};
