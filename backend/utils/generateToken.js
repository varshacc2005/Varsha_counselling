const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none', // Allow cross-domain cookies in production
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production (required for sameSite 'none')
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

module.exports = generateToken;
