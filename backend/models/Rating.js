const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    setCode: { type: String, required: true, index: true },
    overallRating: { type: Number, required: true, min: 1, max: 5 },
    difficultyRating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Rating", RatingSchema);
