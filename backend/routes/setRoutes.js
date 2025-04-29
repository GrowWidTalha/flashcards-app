const express = require('express');
const router = express.Router();
const {
    getAllSets,
    createSet,
    getSetByCode,
    updateSet,
    deleteSet,
    getSetsByModule,
    searchSets
} = require('../controllers/setController');

// Get all sets
router.get('/', getAllSets);

// Search sets
router.get('/search', searchSets);

// Get sets by module code
router.get('/module/:moduleCode', getSetsByModule);

// Get a single set by code
router.get('/:setCode', getSetByCode);

// Create a new set
router.post('/', createSet);

// Update a set
router.put('/:setCode', updateSet);

// Delete a set
router.delete('/:setCode', deleteSet);

module.exports = router;
