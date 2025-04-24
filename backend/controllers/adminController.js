const Question = require('../models/Question');
const { parseCSV } = require('../utils/csvFormatter');

exports.addAdminQuestions = async (req, res) => {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty questions array' });
    }
    try {
        await Question.insertMany(questions);
        res.json({ message: 'Admin questions added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.replaceAdminQuestions = async (req, res) => {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty questions array' });
    }
    try {
        await Question.deleteMany();
        await Question.insertMany(questions);
        res.json({ message: 'Admin questions replaced successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAdminQuestions = async (req, res) => {
    try {
        const questions = await Question.find().sort({ setCode: 1, serialNumber: 1 });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.exportAdminCSV = async (req, res) => {
    try {
        const questions = await Question.find().lean();
        if (!questions.length) {
            return res.status(404).json({ error: 'No admin questions to export' });
        }
        const csvData = parseCSV(questions);
        res.header('Content-Type', 'text/csv');
        res.attachment('admin_questions.csv');
        res.send(csvData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
