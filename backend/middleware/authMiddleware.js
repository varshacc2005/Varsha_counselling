const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Counselor = require('../models/Counselor');

const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            let user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                user = await Counselor.findById(decoded.userId).select('-password');
            }
            req.user = user;
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.error('No token found in cookies');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const counselor = (req, res, next) => {
    // Check if the user object has specialization field (or check role if we added one, but specialization is unique to counselor schema)
    // Or we can add a 'role' field to Counselor schema to be consistent. 
    // For now, let's assume if it has 'specialization' it is a counselor, or we can check the model.
    // Actually, in User model we have 'role'. In Counselor we didn't add 'role' explicitly but user is separate. 
    // Let's add 'role' to Counselor model virtually or explicitly? 
    // In my Counselor model I didn't add role. I should have. 
    // But I can check if req.user.specialization exists.
    if (req.user && (req.user.domain || req.user.role === 'counselor')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a counselor' });
    }
};

module.exports = { protect, admin, counselor };
