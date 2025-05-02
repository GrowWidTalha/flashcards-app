const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    set: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Set",
        required: true
    },
    setCode: {
        type: String,
        required: true
    },
    answers: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        },
        questionText: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean
    }],
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);
