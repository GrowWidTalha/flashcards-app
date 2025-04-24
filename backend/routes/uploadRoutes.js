const express = require('express');
const router = express.Router();
const { uploadQuestions } = require('../controllers/uploadController');

router.post('/', uploadQuestions);
module.exports = router;
