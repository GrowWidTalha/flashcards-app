const mongoose = require('mongoose');

const SetSchema = new mongoose.Schema({
    // Unique identifier with hierarchical structure (e.g., W03.01.01)
    setCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // The module this set belongs to (e.g., W03)
    moduleCode: {
        type: String,
        required: true,
        trim: true,
        ref: 'Module'
    },
    // Set group code (e.g., W03.01)
    setGroup: {
        type: String,
        required: true,
        trim: true
    },
    // Set name
    setName: {
        type: String,
        required: true,
        trim: true
    },
    // Set description
    setDescription: {
        type: String,
        trim: true
    },
    // Category
    category: String,
    subCategory1: String,
    subCategory2: String,
    // Order within module for sorting
    setOrder: {
        type: Number,
        required: true
    },
    // Short serial number for easier lookup
    serialNumber: {
        type: String,
        required: true
    },
    // Created by admin or user
    createdBy: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin'
    },
    // Number of questions in this set
    questionCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Set', SetSchema);
