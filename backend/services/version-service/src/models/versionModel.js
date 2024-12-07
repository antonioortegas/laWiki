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
    },
    imageSrc:{
        type: String,
        required: false
    },
    latitude:{
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    zoom: {
        type: Number,
        required: false
    },
    map:{
        type: String,
        required: false
    }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Version', versionSchema);