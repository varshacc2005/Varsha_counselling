const User = require('../models/User');
const Counselor = require('../models/Counselor');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password, role } = req.body;

    // Login for Student/Admin
    if (role === 'student' || role === 'admin') {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            if (role === 'admin' && user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized as admin' });
            }
            if (role === 'student' && user.role === 'admin') {
                return res.status(401).json({ message: 'Please use the admin login portal' });
            }

            generateToken(res, user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    // Login for Counselor
    else if (role === 'counselor') {
        const counselor = await Counselor.findOne({ email });
        if (counselor && (await counselor.matchPassword(password))) {
            generateToken(res, counselor._id);
            res.json({
                _id: counselor._id,
                name: counselor.name,
                email: counselor.email,
                role: 'counselor',
                domain: counselor.domain,
                universityName: counselor.universityName,
                desc: counselor.desc,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } else {
        res.status(400).json({ message: 'Invalid role' });
    }
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'student', // Default to student
    });

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    authUser,
    registerUser,
    logoutUser,
};
