const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
    wiki: {
        type: String,
        required: true
    },
    entryId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        default: '',
        required: false
    },
    map: {
        type: String,
        default: '',
        required: false
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
    longitude: {
        type: Number,
        required: false
    },
    latitude: {
        type: Number,
        required: false
    },
    zoom: {
        type: Number,
        required: false
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