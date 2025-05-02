const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// All routes are protected and for admin only
// The actual admin check is done in the controllers

// GET all users
router.get('/users', protect, getAllUsers);

// GET a specific user
router.get('/users/:id', protect, getUserById);

// UPDATE a user
router.patch('/users/:id', protect, updateUser);

// DELETE a user
router.delete('/users/:id', protect, deleteUser);

module.exports = router;
