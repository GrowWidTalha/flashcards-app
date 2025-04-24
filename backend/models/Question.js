const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: String,
    answer: String,
    moreInfo: String,
    setCode: String,
    setName: String,
    setDescription: String,
    category: String,
    subCategory1: String,
    subCategory2: String,
    serialNumber: String,
    createdBy: { type: String, enum: ['admin', 'user'], default: 'user' }, // NEW
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
