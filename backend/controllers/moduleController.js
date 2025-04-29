const Module = require('../models/Module');
const Set = require('../models/Set');

// Get all modules
exports.getAllModules = async (req, res) => {
    try {
        const modules = await Module.find().sort({ moduleCode: 1 });
        res.json(modules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new module
exports.createModule = async (req, res) => {
    try {
        const { moduleCode, moduleName, moduleDescription } = req.body;

        if (!moduleCode) {
            return res.status(400).json({ error: 'Module code is required' });
        }

        // Check if module code already exists
        const existingModule = await Module.findOne({ moduleCode });
        if (existingModule) {
            return res.status(400).json({ error: 'Module code already exists' });
        }

        const newModule = new Module({
            moduleCode,
            moduleName: moduleName || moduleCode, // Use code as name if none provided
            moduleDescription: moduleDescription || '',
            createdBy: req.body.createdBy || 'admin'
        });

        await newModule.save();
        res.status(201).json(newModule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single module by code
exports.getModuleByCode = async (req, res) => {
    try {
        const { moduleCode } = req.params;
        const module = await Module.findOne({ moduleCode });

        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }

        // Get all sets in this module
        const sets = await Set.find({ moduleCode }).sort({ setOrder: 1 });

        res.json({
            module,
            sets
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a module
exports.updateModule = async (req, res) => {
    try {
        const { moduleCode } = req.params;
        const { moduleName, moduleDescription } = req.body;

        const updatedModule = await Module.findOneAndUpdate(
            { moduleCode },
            {
                moduleName: moduleName || undefined,
                moduleDescription: moduleDescription || undefined
            },
            { new: true }
        );

        if (!updatedModule) {
            return res.status(404).json({ error: 'Module not found' });
        }

        res.json(updatedModule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a module
exports.deleteModule = async (req, res) => {
    try {
        const { moduleCode } = req.params;

        // Check if module has any sets
        const setsCount = await Set.countDocuments({ moduleCode });
        if (setsCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete module that contains sets. Delete all sets first.'
            });
        }

        const deletedModule = await Module.findOneAndDelete({ moduleCode });

        if (!deletedModule) {
            return res.status(404).json({ error: 'Module not found' });
        }

        res.json({ message: 'Module deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
