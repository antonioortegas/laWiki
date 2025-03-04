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
    profilePicture: {
        type: String,
    },
    getNotificationsByEmail: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        required: true,
        enum: ['reader', 'writer', 'editor', 'admin'],
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
    },
    comments: {
        type: [{
            entryId: {
                type: String,
                required: true
            },
            commentId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            content: {
                type: String,
                required: true
            },
            responseTo: {
                type: mongoose.Schema.Types.ObjectId,
                default: null
            }
        }],
    },
    entries: {
        type: [{
            entryId: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
        }],
        default: []
    }
},
    {
        timestamps: true
    }
);

userSchema.pre('save', function (next) {
    if (this.isModified('ratings')) {
        const sum = this.ratings.reduce((acc, rating) => acc + rating.score, 0);
        this.averageRating = this.ratings.length ? sum / this.ratings.length : 0;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
