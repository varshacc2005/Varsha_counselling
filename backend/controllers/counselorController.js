const Counselor = require('../models/Counselor');
const Booking = require('../models/Booking');
const SessionNote = require('../models/SessionNote'); // Need to create this model
const { sendBookingConfirmationEmail, sendMeetingDetailsEmail } = require('../utils/emailService');

// @desc    Add availability slots
// @route   POST /api/counselor/slots
// @access  Private/Counselor
// @desc    Add availability slots (Calendly-style)
// @route   POST /api/counselor/slots
// @access  Private/Counselor
// @desc    Add availability slots (Date Range)
// @route   POST /api/counselor/slots
// @access  Private/Counselor
const addSlots = async (req, res) => {
    const { startDate, endDate, startTime, endTime, duration } = req.body;
    const counselor = await Counselor.findById(req.user._id);

    if (!counselor) {
        return res.status(404).json({ message: 'Counselor not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const newSlots = [];

    // Loop through each day from startDate to endDate
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const currentDateStr = d.toISOString().split('T')[0];

        // Parse start and end times for the day
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        let currentHour = startHour;
        let currentMinute = startMinute;

        // Loop to create slots for the current day
        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

            let totalMinutes = currentMinute + parseInt(duration);
            let nextHour = currentHour + Math.floor(totalMinutes / 60);
            let nextMinute = totalMinutes % 60;

            if (nextHour > endHour || (nextHour === endHour && nextMinute > endMinute)) {
                break;
            }

            const slotEnd = `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`;

            newSlots.push({
                date: currentDateStr,
                startTime: slotStart,
                endTime: slotEnd,
                isBooked: false,
            });

            currentHour = nextHour;
            currentMinute = nextMinute;
        }
    }

    counselor.availability.push(...newSlots);
    await counselor.save();
    res.status(201).json(counselor.availability);
};

// @desc    Get bookings for counselor
// @route   GET /api/counselor/bookings
// @access  Private/Counselor
const getCounselorBookings = async (req, res) => {
    const bookings = await Booking.find({ counselorId: req.user._id })
        .populate('studentId', 'name email')
        .sort({ createdAt: -1 });
    res.json(bookings);
};

// @desc    Approve/Decline booking
// @route   PUT /api/counselor/bookings/:id
// @access  Private/Counselor
const updateBookingStatus = async (req, res) => {
    const { status } = req.body; // approved, declined
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        if (booking.counselorId.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        booking.status = status;
        await booking.save();

        // If declined, free up the slot? 
        if (status === 'declined' || status === 'cancelled') {
            const counselor = await Counselor.findById(req.user._id);
            const slotToFree = counselor.availability.find(
                s => s.date.toISOString() === booking.slot.date.toISOString() &&
                    s.startTime === booking.slot.startTime
            );
            if (slotToFree) {
                slotToFree.isBooked = false;
                await counselor.save();
            }
        }

        // Re-fetch booking with populate to get details for email
        const populatedBooking = await Booking.findById(req.params.id)
            .populate('studentId', 'name email')
            .populate('counselorId', 'name email');

        if (populatedBooking && populatedBooking.studentId) {
            // 1. Send generic confirmation/update email to student
            await sendBookingConfirmationEmail(
                populatedBooking.studentId.email,
                populatedBooking.counselorId.name,
                populatedBooking.slot.date,
                populatedBooking.slot.startTime,
                status
            );

            // 2. If approved, send explicit meeting details to both
            if (status === 'approved') {
                await sendMeetingDetailsEmail(
                    populatedBooking.studentId.email,
                    populatedBooking.studentId.name,
                    populatedBooking.counselorId.email,
                    populatedBooking.counselorId.name,
                    populatedBooking.slot.date,
                    populatedBooking.slot.startTime,
                    populatedBooking._id
                );
            }
        }

        res.json(booking);
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
};

// @desc    Add session note
// @route   POST /api/counselor/notes
// @access  Private/Counselor
const addSessionNote = async (req, res) => {
    const { bookingId, notes } = req.body;

    // Create new note
    const sessionNote = await SessionNote.create({
        bookingId,
        counselorId: req.user._id,
        notes,
    });

    res.status(201).json(sessionNote);
};

// @desc    Update counselor profile
// @route   PUT /api/counselor/profile
// @access  Private/Counselor
const updateProfile = async (req, res) => {
    const counselor = await Counselor.findById(req.user._id);

    if (counselor) {
        counselor.name = req.body.name || counselor.name;
        counselor.email = req.body.email || counselor.email;
        counselor.domain = req.body.domain || counselor.domain;
        counselor.universityName = req.body.universityName || counselor.universityName;
        counselor.desc = req.body.desc || counselor.desc;

        // New Profile Fields
        if (req.body.skills) counselor.skills = req.body.skills;
        if (req.body.services) counselor.services = req.body.services;
        if (req.body.experience !== undefined) counselor.experience = req.body.experience;
        if (req.body.languages) counselor.languages = req.body.languages;
        if (req.body.price !== undefined) counselor.price = req.body.price;
        if (req.body.photo) counselor.photo = req.body.photo;

        if (req.body.password) {
            counselor.password = req.body.password;
        }

        const updatedCounselor = await counselor.save();

        res.json({
            _id: updatedCounselor._id,
            name: updatedCounselor.name,
            email: updatedCounselor.email,
            domain: updatedCounselor.domain,
            universityName: updatedCounselor.universityName,
            desc: updatedCounselor.desc,
            skills: updatedCounselor.skills,
            services: updatedCounselor.services,
            experience: updatedCounselor.experience,
            languages: updatedCounselor.languages,
            price: updatedCounselor.price,
            photo: updatedCounselor.photo,
        });
    } else {
        res.status(404).json({ message: 'Counselor not found' });
    }
};

module.exports = {
    addSlots,
    getCounselorBookings,
    updateBookingStatus,
    addSessionNote,
    updateProfile,
};
