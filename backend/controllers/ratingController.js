const Rating = require("../models/Rating");

// POST /api/rating
// body: { setCode, overallRating, defaultRating, comment? }
exports.createRating = async (req, res) => {
    const userId = req.user.id;              // from your auth middleware
    const { setCode, overallRating, difficultyRating } = req.body;

    if (!setCode || !overallRating || !difficultyRating) {
        return res.status(400).json({ message: "setCode, overallRating and defaultRating are required" });
    }

    try {
        const rating = await Rating.create({
            user: userId,
            setCode,
            overallRating,
            difficultyRating: difficultyRating,
        });
        res.status(201).json({ message: "Rating recorded", rating });
    } catch (err) {
        console.error("Error creating rating:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/rating/set/:setCode
// returns all ratings for a given set
exports.getRatingsForSet = async (req, res) => {
    try {
        const ratings = await Rating.find({ setCode: req.params.setCode })
            .populate("user", "username")   // optional: include username
            .sort({ createdAt: -1 });
        res.json(ratings);
    } catch (err) {
        console.error("Error fetching ratings:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/rating/user
// returns all ratings by logged-in user
exports.getRatingsByUser = async (req, res) => {
    try {
        const ratings = await Rating.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(ratings);
    } catch (err) {
        console.error("Error fetching user ratings:", err);
        res.status(500).json({ message: "Server error" });
    }
};
