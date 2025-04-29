const express = require('express');
const router = express.Router();
const {
    getAllModules,
    createModule,
    getModuleByCode,
    updateModule,
    deleteModule
} = require('../controllers/moduleController');

// Get all modules
router.get('/', getAllModules);

// Create a new module
router.post('/', createModule);

// Get a single module by code
router.get('/:moduleCode', getModuleByCode);

// Update a module
router.put('/:moduleCode', updateModule);

// Delete a module
router.delete('/:moduleCode', deleteModule);

module.exports = router;
