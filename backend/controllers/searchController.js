const Question = require('../models/Question');
const Module = require('../models/Module');
const Set = require('../models/Set');

// Enhanced search across all content
exports.searchContent = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({ error: 'Search query must be at least 2 characters' });
        }

        const searchRegex = new RegExp(query, 'i');

        // Search in modules
        const modules = await Module.find({
            $or: [
                { moduleCode: searchRegex },
                { moduleName: searchRegex },
                { moduleDescription: searchRegex }
            ]
        }).lean();

        // Search in sets
        const sets = await Set.find({
            $or: [
                { setCode: searchRegex },
                { setName: searchRegex },
                { setDescription: searchRegex },
                { moduleCode: searchRegex }
            ]
        }).sort({ moduleCode: 1, setOrder: 1 }).lean();

        // Search in questions
        const questions = await Question.find({
            $or: [
                { question: searchRegex },
                { answer: searchRegex },
                { moreInfo: searchRegex },
                { setCode: searchRegex },
                { moduleCode: searchRegex }
            ]
        }).sort({ moduleCode: 1, setCode: 1, serialNumber: 1 }).lean();

        // Enrich questions with module and set information
        const enrichedQuestions = await Promise.all(questions.map(async (q) => {
            const module = await Module.findOne({ moduleCode: q.moduleCode }).lean();
            const set = await Set.findOne({ setCode: q.setCode }).lean();
            return {
                ...q,
                moduleName: module?.moduleName || q.moduleCode,
                moduleDescription: module?.moduleDescription || '',
                setName: set?.setName || q.setCode,
                setDescription: set?.setDescription || '',
                setOrder: set?.setOrder || 0
            };
        }));

        // Group results by type
        const results = {
            modules: modules.map(m => ({
                ...m,
                type: 'module',
                resultPreview: `Module: ${m.moduleName}`
            })),
            sets: sets.map(s => ({
                ...s,
                type: 'set',
                resultPreview: `Set: ${s.setName} (${s.setCode})`
            })),
            questions: enrichedQuestions.map(q => ({
                ...q,
                type: 'question',
                resultPreview: `Q: ${q.question.substring(0, 100)}${q.question.length > 100 ? '...' : ''}`
            }))
        };

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
};
