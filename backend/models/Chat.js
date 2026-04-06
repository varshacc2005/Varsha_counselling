const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    messages: [{
        senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
        senderRole: { type: String, enum: ['student', 'counselor'], required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    }],
}, {
    timestamps: true,
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
