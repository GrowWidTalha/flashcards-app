const express = require('express');
const router = express.Router();
const { uploadQuestions, processExcelUpload } = require('../controllers/uploadController');

router.post('/', uploadQuestions);

// Route for processing Excel file uploads
router.post('/excel', processExcelUpload);

module.exports = router;
