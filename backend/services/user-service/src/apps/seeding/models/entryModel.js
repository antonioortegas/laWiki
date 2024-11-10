const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
    wiki: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
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
    editors: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    atachments: {
        type: [String],
        default: [],
    },
    version: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    comments: {
        type: [{
            author: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            content: {
                type: String,
                required: true
            },
            responseTo: {
                type: mongoose.Schema.Types.ObjectId,
            },
        }],
        default: []
    },
    tags: {
        type: [String],
        default: [],
    }},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Entry', EntrySchema);