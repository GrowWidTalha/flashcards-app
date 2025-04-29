const express = require('express');
const router = express.Router();
const {
    getAllQuestions,
    uploadUserQuestions,
    getQuestionsBySet,
    getQuestionsByModule,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    checkUserAnswer
} = require('../controllers/questionController');

// Get all questions
router.get('/', getAllQuestions);

// Get questions by set code
router.get('/set/:setCode', getQuestionsBySet);

// Get questions by module code
router.get('/module/:moduleCode', getQuestionsByModule);

// Create a new question
router.post('/', createQuestion);

// Update a question
router.put('/:id', updateQuestion);

// Delete a question
router.delete('/:id', deleteQuestion);

// Upload user questions
router.post("/upload", uploadUserQuestions);

// Check user answer
router.post("/answer", checkUserAnswer);

module.exports = router;
