const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    entry: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Version', versionSchema);