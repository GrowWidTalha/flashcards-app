const express = require('express');
const router = express.Router();
const quizAttemptController = require('../controllers/quizAttemptController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Record an answer
router.post('/record-answer', quizAttemptController.recordAnswer);

// Complete a quiz attempt
router.post('/complete', quizAttemptController.completeAttempt);

// Get all attempts for the current user
router.get('/user-attempts', quizAttemptController.getUserAttempts);

// Get attempts for a specific set
router.get('/set-attempts/:setId', quizAttemptController.getSetAttempts);

// Get details for a specific attempt
router.get('/attempt/:attemptId', quizAttemptController.getAttemptDetails);

module.exports = router;
