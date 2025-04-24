const Question = require('../models/Question');

exports.uploadQuestions = async (req, res) => {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty questions array' });
    }

    try {
        await Question.deleteMany();
        await Question.insertMany(questions);
        res.json({ message: 'Questions uploaded successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
