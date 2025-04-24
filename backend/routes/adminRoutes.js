const express = require('express');
const router = express.Router();
const {
    addAdminQuestions,
    replaceAdminQuestions,
    getAdminQuestions,
    exportAdminCSV,
} = require('../controllers/adminController');

router.post('/upload', addAdminQuestions);
router.post('/replace', replaceAdminQuestions);
router.get('/questions', getAdminQuestions);
router.get('/export', exportAdminCSV);
module.exports = router;
