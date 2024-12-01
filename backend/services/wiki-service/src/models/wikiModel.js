const mongoose = require('mongoose');

const wikiSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    entryUUIDs: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
    },
    content: {
        type: String,
    },
    src: {
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
    },
    numberOfEntries: {
        type: Number,
        default: 0, // Initialize to 0 by default
    }
}, 
{
    timestamps: true
});

// Pre-save hook to update `numberOfEntries`
wikiSchema.pre('save', function (next) {
    if (this.isModified('entryUUIDs')) {
        this.numberOfEntries = this.entryUUIDs.length;
    }
    next();
});

module.exports = mongoose.model('Wiki', wikiSchema);
