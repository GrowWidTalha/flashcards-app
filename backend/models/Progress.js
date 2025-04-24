const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    setCode: { type: String, required: true },
    timesPracticed: { type: Number, default: 1 },
    questionCount: { type: Number, required: true },
    lastAttempted: { type: Date, default: Date.now },
}, {
    timestamps: true,
    // ensure one record per user+set
    indexes: [{ fields: { user: 1, setCode: 1 }, options: { unique: true } }]
});

module.exports = mongoose.model("Progress", ProgressSchema);
