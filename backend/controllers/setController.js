const Set = require('../models/Set');
const Module = require('../models/Module');
const Question = require('../models/Question');

// Get all sets
exports.getAllSets = async (req, res) => {
    try {
        const sets = await Set.find().sort({ moduleCode: 1, setOrder: 1 });
        res.json(sets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new set
exports.createSet = async (req, res) => {
    try {
        const {
            setCode,
            moduleCode,
            setGroup,
            setName,
            setDescription,
            category,
            subCategory1,
            subCategory2,
            setOrder,
            serialNumber
        } = req.body;

        // Check if module exists - create if it doesn't
        let module = await Module.findOne({ moduleCode });
        if (!module) {
            module = new Module({
                moduleCode,
                moduleName: moduleCode,
                moduleDescription: '',
                createdBy: req.body.createdBy || 'admin'
            });
            await module.save();
        }

        // Check if set code already exists
        const existingSet = await Set.findOne({ setCode });
        if (existingSet) {
            return res.status(400).json({ error: 'Set code already exists' });
        }

        const newSet = new Set({
            setCode,
            moduleCode,
            setGroup: setGroup || moduleCode,
            setName: setName || setCode,
            setDescription: setDescription || '',
            category,
            subCategory1,
            subCategory2,
            setOrder: parseFloat(setOrder) || 1,
            serialNumber: serialNumber || setCode,
            createdBy: req.body.createdBy || 'admin'
        });

        await newSet.save();
        res.status(201).json(newSet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single set by code
exports.getSetByCode = async (req, res) => {
    try {
        const { setCode } = req.params;
        const set = await Set.findOne({ setCode });

        if (!set) {
            return res.status(404).json({ error: 'Set not found' });
        }

        // Get all questions in this set
        const questions = await Question.find({ setCode }).sort({ serialNumber: 1 });

        res.json({
            set,
            questions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a set
exports.updateSet = async (req, res) => {
    try {
        const { setCode } = req.params;
        const {
            setName,
            setDescription,
            category,
            subCategory1,
            subCategory2,
            setOrder,
            serialNumber
        } = req.body;

        const updatedSet = await Set.findOneAndUpdate(
            { setCode },
            {
                setName,
                setDescription,
                category,
                subCategory1,
                subCategory2,
                setOrder: parseFloat(setOrder) || undefined,
                serialNumber
            },
            { new: true }
        );

        if (!updatedSet) {
            return res.status(404).json({ error: 'Set not found' });
        }

        res.json(updatedSet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a set
exports.deleteSet = async (req, res) => {
    try {
        const { setCode } = req.params;

        // Check if set has any questions
        const questionsCount = await Question.countDocuments({ setCode });
        if (questionsCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete set that contains questions. Delete all questions first.'
            });
        }

        const deletedSet = await Set.findOneAndDelete({ setCode });

        if (!deletedSet) {
            return res.status(404).json({ error: 'Set not found' });
        }

        res.json({ message: 'Set deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get sets by module code
exports.getSetsByModule = async (req, res) => {
    try {
        const { moduleCode } = req.params;

        // Check if module exists
        const module = await Module.findOne({ moduleCode });
        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }

        const sets = await Set.find({ moduleCode }).sort({ setOrder: 1 });

        res.json(sets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Search sets and modules by code or keywords
exports.searchSets = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({ error: 'Search query must be at least 2 characters' });
        }

        const searchRegex = new RegExp(query, 'i');

        // Search for sets
        const sets = await Set.find({
            $or: [
                { setCode: searchRegex },
                { setName: searchRegex },
                { setDescription: searchRegex },
                { moduleCode: searchRegex },
                { setGroup: searchRegex }
            ]
        }).sort({ moduleCode: 1, setOrder: 1 }).limit(20);

        // Search for modules
        const modules = await Module.find({
            $or: [
                { moduleCode: searchRegex },
                { moduleName: searchRegex },
                { moduleDescription: searchRegex }
            ]
        }).sort({ moduleCode: 1 }).limit(20);

        // Add question count to each set
        const setsWithQuestionCount = await Promise.all(sets.map(async (set) => {
            const count = await Question.countDocuments({ setCode: set.setCode });
            return {
                ...set.toObject(),
                questionCount: count
            };
        }));

        res.json({
            modules,
            sets: setsWithQuestionCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update question count for a set
exports.updateQuestionCount = async (setCode) => {
    try {
        const count = await Question.countDocuments({ setCode });
        const result = await Set.findOneAndUpdate(
            { setCode },
            { questionCount: count },
            { new: true }
        );

        if (!result) {
            console.log(`Set ${setCode} not found when updating question count`);
        }

        return count;
    } catch (err) {
        console.error('Error updating question count:', err);
        return 0;
    }
};
