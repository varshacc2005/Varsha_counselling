const User = require('../models/User');
const Counselor = require('../models/Counselor');
const Booking = require('../models/Booking');

// @desc    Add a new counselor
// @route   POST /api/admin/counselor
// @access  Private/Admin
const addCounselor = async (req, res) => {
    const { name, email, password, domain, universityName, desc } = req.body;

    const counselorExists = await Counselor.findOne({ email });

    if (counselorExists) {
        res.status(400).json({ message: 'Counselor already exists' });
        return;
    }

    const counselor = await Counselor.create({
        name,
        email,
        password,
        domain,
        universityName,
        desc,
    });

    if (counselor) {
        res.status(201).json({
            _id: counselor._id,
            name: counselor.name,
            email: counselor.email,
            domain: counselor.domain,
            universityName: counselor.universityName,
            desc: counselor.desc,
        });
    } else {
        res.status(400).json({ message: 'Invalid counselor data' });
    }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalCounselors = await Counselor.countDocuments({});
    const totalBookings = await Booking.countDocuments({});

    // Maybe some breakdown by status
    // Breakdown by status
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'approved' });
    const declinedBookings = await Booking.countDocuments({ status: 'declined' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Monthly Bookings for Line Chart
    const monthlyBookings = await Booking.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Format monthly data for frontend [ {name: 'Jan', bookings: 10}, ... ]
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthlyBookings.map(item => ({
        name: months[item._id - 1],
        bookings: item.count
    }));

    // Counselor Performance for Bar Chart
    const counselorBookings = await Booking.aggregate([
        {
            $group: {
                _id: "$counselorId",
                count: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "counselors",
                localField: "_id",
                foreignField: "_id",
                as: "counselorInfo"
            }
        },
        { $unwind: "$counselorInfo" },
        {
            $project: {
                name: "$counselorInfo.name",
                bookings: "$count"
            }
        },
        { $sort: { bookings: -1 } },
        { $limit: 5 }
    ]);

    res.json({
        totalUsers,
        totalCounselors,
        totalBookings,
        pendingBookings,
        approvedBookings,
        declinedBookings,
        completedBookings,
        monthlyData,
        counselorData: counselorBookings
    });
};

// @desc    Get all users (students)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // 1 for asc, -1 for desc

    const skip = (page - 1) * limit;

    let query = { role: 'student' };

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    const sort = {};
    sort[sortField] = sortOrder;

    try {
        const totalUsers = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.json({
            users,
            totalUsers,
            page,
            pages: Math.ceil(totalUsers / limit),
            limit,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all counselors
// @route   GET /api/admin/counselors
// @access  Private/Admin
const getCounselors = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // 1 for asc, -1 for desc

    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { domain: { $regex: search, $options: 'i' } },
            { universityName: { $regex: search, $options: 'i' } },
        ];
    }

    const sort = {};
    sort[sortField] = sortOrder;

    try {
        const totalCounselors = await Counselor.countDocuments(query);
        const counselors = await Counselor.find(query)
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.json({
            counselors,
            totalCounselors,
            page,
            pages: Math.ceil(totalCounselors / limit),
            limit,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update counselor
// @route   PUT /api/admin/counselor/:id
// @access  Private/Admin
const updateCounselor = async (req, res) => {
    const counselor = await Counselor.findById(req.params.id);

    if (counselor) {
        counselor.name = req.body.name || counselor.name;
        counselor.email = req.body.email || counselor.email;
        counselor.domain = req.body.domain || counselor.domain;
        counselor.universityName = req.body.universityName || counselor.universityName;
        counselor.desc = req.body.desc || counselor.desc;

        const updatedCounselor = await counselor.save();
        res.json(updatedCounselor);
    } else {
        res.status(404).json({ message: 'Counselor not found' });
    }
};

// @desc    Delete counselor
// @route   DELETE /api/admin/counselor/:id
// @access  Private/Admin
const deleteCounselor = async (req, res) => {
    const counselor = await Counselor.findById(req.params.id);

    if (counselor) {
        await counselor.deleteOne();
        res.json({ message: 'Counselor removed' });
    } else {
        res.status(404).json({ message: 'Counselor not found' });
    }
};

// @desc    Update user (student)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete user (student)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    addCounselor,
    getStats,
    getUsers,
    getCounselors,
    updateCounselor,
    deleteCounselor,
    updateUser,
    deleteUser,
};
