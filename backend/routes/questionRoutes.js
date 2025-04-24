const express = require('express');
const router = express.Router();
const {
    getAllQuestions,
    uploadUserQuestions,
    getQuestionsBySet,
} = require('../controllers/questionController');

router.get('/', getAllQuestions);
router.get('/:setCode', getQuestionsBySet);
router.post("/upload", uploadUserQuestions);
module.exports = router;
