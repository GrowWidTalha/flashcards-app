const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    improvements: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
