const express = require('express');
const router = express.Router();
const { searchContent } = require('../controllers/searchController');

// Enhanced search endpoint
router.get('/', searchContent);

module.exports = router;
