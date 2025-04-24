const Progress = require("../models/Progress");

// POST /api/progress/record
// body: { setCode: string, questionCount: number }
exports.recordProgress = async (req, res) => {
    const userId = req.user.id;           // set by your auth middleware
    const { setCode, questionCount } = req.body;

    if (!setCode || !questionCount) {
        return res.status(400).json({ message: "setCode and questionCount required" });
    }

    try {
        // Try update existing record
        const updated = await Progress.findOneAndUpdate(
            { user: userId, setCode },
            {
                $inc: { timesPracticed: 1 },
                $set: {
                    questionCount,
                    lastAttempted: new Date(),
                }
            },
            { new: true }
        );

        if (updated) {
            return res.json({ message: "Progress updated", progress: updated });
        }

        // No existing record → create new
        const created = await Progress.create({
            user: userId,
            setCode,
            questionCount,
            // timesPracticed defaults to 1, lastAttempted to now
        });

        res.status(201).json({ message: "Progress recorded", progress: created });
    } catch (err) {
        console.error("Error recording progress:", err);
        // Handle duplicate key error if two requests race
        if (err.code === 11000) {
            return exports.recordProgress(req, res);
        }
        res.status(500).json({ message: "Server error" });
    }
};
