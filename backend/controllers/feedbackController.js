const Feedback = require("../models/Feedback");

// POST /api/feedback
exports.createFeedback = async (req, res) => {
    try {
        const { message, improvements } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Feedback message is required" });
        }

        const feedback = await Feedback.create({
            message,
            improvements: improvements || ""
        });

        res.status(201).json({ message: "Feedback submitted successfully", feedback });
    } catch (err) {
        console.error("Error creating feedback:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/feedback
exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        console.error("Error fetching feedback:", err);
        res.status(500).json({ message: "Server error" });
    }
};
