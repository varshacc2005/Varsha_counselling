const express = require('express');
const router = express.Router();
const {
    addCounselor,
    getStats,
    getUsers,
    getCounselors,
    updateCounselor,
    deleteCounselor,
    updateUser,
    deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/counselor', protect, admin, addCounselor);
router.get('/stats', protect, admin, getStats);
router.get('/users', protect, admin, getUsers);
router.get('/counselors', protect, admin, getCounselors);
router.put('/counselor/:id', protect, admin, updateCounselor);
router.delete('/counselor/:id', protect, admin, deleteCounselor);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
