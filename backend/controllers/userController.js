const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
exports.getAllUsers = async (req, res) => {
    try {
        // Check if the user is an admin (assuming the auth middleware adds user to req)
        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Access denied. Admin only.' });
        // }

        const users = await User.find()
            .select('-password') // Exclude password from the response
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Admin only
exports.getUserById = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Server error while fetching user' });
    }
};

// @desc    Update user
// @route   PATCH /api/admin/users/:id
// @access  Admin only
exports.updateUser = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const allowedUpdates = ['name', 'email', 'role', 'status', 'isVerified'];
        const updates = Object.keys(req.body);

        // Filter out any fields that aren't allowed to be updated
        const validUpdates = {};
        updates.forEach(update => {
            if (allowedUpdates.includes(update)) {
                validUpdates[update] = req.body[update];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.params.id,
            validUpdates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Server error while updating user' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
exports.deleteUser = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Server error while deleting user' });
    }
};
