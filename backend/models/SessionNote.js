const mongoose = require('mongoose');

const sessionNoteSchema = mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    counselorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Counselor',
        required: true,
    },
    notes: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const SessionNote = mongoose.model('SessionNote', sessionNoteSchema);
module.exports = SessionNote;
