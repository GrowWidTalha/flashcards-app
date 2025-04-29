const Comment = require('../models/Comment');
const User = require('../models/User');

// Add a comment to a question
exports.addComment = async (req, res) => {
    try {
        const { setCode, questionId, commentText } = req.body;
        const userId = req.user.id;

        // Get username from user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newComment = new Comment({
            setCode,
            questionId,
            username: user.username || user.email.split('@')[0],
            userId,
            content: commentText
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get comments for a specific question
exports.getQuestionComments = async (req, res) => {
    try {
        const { setCode, questionId } = req.params;

        const comments = await Comment.find({
            setCode,
            questionId
        }).sort({ createdAt: -1 });

        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all comments for a set
exports.getSetComments = async (req, res) => {
    try {
        const { setCode } = req.params;

        const comments = await Comment.find({ setCode }).sort({ createdAt: -1 });

        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a comment (owner or admin only)
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if user is the comment owner or an admin
        if (comment.userId.toString() !== userId && !isAdmin) {
            return res.status(403).json({ error: 'Not authorized to delete this comment' });
        }

        await Comment.findByIdAndDelete(commentId);

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
