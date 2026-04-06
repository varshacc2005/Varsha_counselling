const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    counselorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Counselor',
        required: true,
    },
    slot: {
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined', 'completed', 'cancelled'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
