const express = require('express');
const router = express.Router();
const { authUser, registerUser, logoutUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);

module.exports = router;
