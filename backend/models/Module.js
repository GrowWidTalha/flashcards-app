const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    moduleCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    moduleName: {
        type: String,
        required: true,
        trim: true
    },
    moduleDescription: {
        type: String,
        trim: true
    },
    createdBy: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin'
    }
}, { timestamps: true });

module.exports = mongoose.model('Module', ModuleSchema);
