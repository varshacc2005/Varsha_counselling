const jwt = require('jsonwebtoken');

const generateToken = (req, res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    const isProduction = process.env.NODE_ENV === 'production' || req.get('host').includes('onrender.com');

    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax', // Must be 'none' for cross-domain
        secure: isProduction, // Must be true for sameSite 'none'
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

module.exports = generateToken;
