const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addComment,
    getQuestionComments,
    getSetComments,
    deleteComment
} = require('../controllers/commentController');

// Add a comment (requires auth)
router.post('/add', protect, addComment);

// Get comments for a specific question
router.get('/question/:setCode/:questionId', getQuestionComments);

// Get all comments for a set
router.get('/set/:setCode', getSetComments);

// Delete a comment (requires auth, owner or admin only)
router.delete('/:commentId', protect, deleteComment);

module.exports = router;
