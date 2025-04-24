// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {             // you'll need this for auth
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    city: String,
    age: Number,
    profession: String,
    interests: {
        type: Map,
        of: String,
    },
    attemptedQuizzes: [String],
    addedFeedback: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);
