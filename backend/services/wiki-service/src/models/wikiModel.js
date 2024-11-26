const mongoose = require('mongoose');

const wikiSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    content: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    language: {
        type: String,
        default: 'es',  // Default language is Spanish
    },
    tags: {
        type: [String],
        default: [],  // Array of strings for categories/tags
    },
    entries: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Wiki', wikiSchema);