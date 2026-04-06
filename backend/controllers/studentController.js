const Counselor = require('../models/Counselor');
const Booking = require('../models/Booking');
const { sendBookingRequestEmail, sendWaitingForApprovalEmail } = require('../utils/emailService');

// @desc    Get all counselors
// @route   GET /api/student/counselors
// @access  Private/Student
const getAllCounselors = async (req, res) => {
    // Return all counselors, maybe only active ones?
    // User schema doesn't have isActive, Counselor schema has.
    const counselors = await Counselor.find({ isActive: true }).select('-password');
    res.json(counselors);
};

// @desc    Get slots for a counselor (only UNbooked slots)
// @route   GET /api/student/counselors/:counselorId/slots
// @access  Private/Student
const getCounselorSlots = async (req, res) => {
    const counselor = await Counselor.findById(req.params.counselorId);
    if (counselor) {
        // Only return slots that are NOT already booked
        const availableSlots = counselor.availability.filter(slot => !slot.isBooked);
        res.json(availableSlots);
    } else {
        res.status(404).json({ message: 'Counselor not found' });
    }
};

// @desc    Book a slot
// @route   POST /api/student/bookings
// @access  Private/Student
const bookSlot = async (req, res) => {
    const { counselorId, slotId } = req.body;

    // Find the counselor and the slot
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
        res.status(404).json({ message: 'Counselor not found' });
        return;
    }

    // Find slot in availability array
    const slot = counselor.availability.id(slotId);
    // Mongoose subdocuments have _id by default unless disabled.
    // In Counselor schema: availability: [{ date, startTime, ... }] -> Mongoose adds _id.

    if (!slot) {
        res.status(404).json({ message: 'Slot not found' });
        return;
    }

    if (slot.isBooked) {
        res.status(400).json({ message: 'Slot already booked' });
        return;
    }

    // Create booking
    const booking = await Booking.create({
        studentId: req.user._id,
        counselorId,
        slot: {
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
        },
        status: 'pending',
    });

    if (booking) {
        // Mark slot as booked
        slot.isBooked = true;
        await counselor.save();

        // Send email to counselor
        await sendBookingRequestEmail(
            counselor.email,
            req.user.name,
            slot.date,
            slot.startTime
        );

        // Send "Waiting for Approval" email to student
        await sendWaitingForApprovalEmail(
            req.user.email,
            req.user.name,
            counselor.name,
            slot.date,
            slot.startTime
        );

        res.status(201).json(booking);
    } else {
        res.status(400).json({ message: 'Invalid booking data' });
    }
};

// @desc    Get my bookings
// @route   GET /api/student/bookings
// @access  Private/Student
const getStudentBookings = async (req, res) => {
    const bookings = await Booking.find({ studentId: req.user._id })
        .populate('counselorId', 'name email domain photo')
        .sort({ createdAt: -1 });
    res.json(bookings);
};

// @desc    Cancel a booking
// @route   PUT /api/student/bookings/:bookingId/cancel
// @access  Private/Student
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Ensure the booking belongs to this student
        if (booking.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorised to cancel this booking' });
        }

        // Only pending or approved bookings can be cancelled
        if (!['pending', 'approved'].includes(booking.status)) {
            return res.status(400).json({ message: `Cannot cancel a booking with status: ${booking.status}` });
        }

        // Free the slot on the counselor document
        const counselor = await Counselor.findById(booking.counselorId);
        if (counselor) {
            const slot = counselor.availability.find(
                s =>
                    s.date.toISOString() === new Date(booking.slot.date).toISOString() &&
                    s.startTime === booking.slot.startTime &&
                    s.endTime === booking.slot.endTime
            );
            if (slot) {
                slot.isBooked = false;
                await counselor.save();
            }
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllCounselors,
    getCounselorSlots,
    bookSlot,
    getStudentBookings,
    cancelBooking,
};
