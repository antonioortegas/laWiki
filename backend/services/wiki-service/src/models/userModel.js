const mongoose = require('mongoose');


// ratings stores an array of ratings, which are a ratedBy + score
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['reader', 'writer', 'admin'],
        default: 'reader'
    },
    averageRating: {
        type: Number,
        default: 0
    },
    ratings: {
        type: [{
            ratedBy: {
                type: String,
                required: true
            },
            score: {
                type: Number,
                required: true
            }
        }],
        default: []
    },
    notifications: {
        type: [{
            message: {
                type: String,
                required: true
            },
            read: {
                type: Boolean,
                default: false
            }
        }],
        default: []
    }},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);