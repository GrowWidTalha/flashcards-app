const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: String,
    answer: String,
    moreInfo: String,
    // Module code this question belongs to (e.g., W03)
    moduleCode: {
        type: String,
        required: true,
        ref: 'Module'
    },
    // SetCode with hierarchical format (e.g., W03.01.01)
    setCode: {
        type: String,
        required: true,
        ref: 'Set'
    },
    // Set group (e.g., W03.01)
    setGroup: {
        type: String
    },
    setName: String,
    setDescription: String,
    category: String,
    subCategory1: String,
    subCategory2: String,
    // Question number within the set
    serialNumber: String,
    // Created by admin or user
    createdBy: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
