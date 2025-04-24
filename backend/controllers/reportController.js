const Report = require("../models/Report");

// POST /api/report
// body: { setCode, qualityRating, message? }
exports.createReport = async (req, res) => {
    const userId = req.user.id; // from auth middleware
    const { setCode, qualityRating, message } = req.body;

    if (!setCode || !qualityRating) {
        return res
            .status(400)
            .json({ message: "setCode and qualityRating are required" });
    }

    try {
        const report = await Report.create({
            user: userId,
            setCode,
            qualityRating,
            message: message || ""
        });
        res.status(201).json({ message: "Report created", report });
    } catch (err) {
        console.error("Error creating report:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/report/set/:setCode
// list all reports for a given set
exports.getReportsForSet = async (req, res) => {
    try {
        const reports = await Report.find({ setCode: req.params.setCode })
            .populate("user", "username")
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error("Error fetching reports:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/report/user
// list all reports by the logged-in user
exports.getReportsByUser = async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user.id }).sort({
            createdAt: -1
        });
        res.json(reports);
    } catch (err) {
        console.error("Error fetching user reports:", err);
        res.status(500).json({ message: "Server error" });
    }
};
