const mongoose = require("mongoose");

const VerificationTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 43200 // Token expires after 12 hours (in seconds)
    }
});

module.exports = mongoose.model("VerificationToken", VerificationTokenSchema);
