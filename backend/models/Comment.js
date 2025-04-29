const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    setCode: {
        type: String,
        required: true,
        trim: true
    },
    questionId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
