const Question = require('../models/Question');

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().sort({ setCode: 1, serialNumber: 1 });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.uploadUserQuestions = async (req, res) => {
    try {
        const { questions } = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Invalid or empty questions array" });
        }

        // Add createdBy = 'user' to each question
        const enrichedQuestions = questions.map(q => ({ ...q, createdBy: 'user' }));
        await Question.insertMany(enrichedQuestions);

        res.status(200).json({ message: "User questions uploaded successfully" });
    } catch (error) {
        console.error("Error uploading user questions:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.getQuestionsBySet = async (req, res) => {
    try {
        const { setCode } = req.params;
        const list = await Question.find({ setCode });
        if (!list.length) return res.status(404).json({ error: 'Set not found' });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
