const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: '__type',
    collection: 'data',
    timestamps: true
};

export const postSchema = mongoose.model('Post', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalComments: {
        type: Number,
        default: 0
    },
    totalLikes: {
        type: Number,
        default: 0
    }
}, baseOptions));

export const urlSchema = postSchema.discriminator('Url', new mongoose.Schema({
    url: {
        type: String,
        required: true
    }
}));

export const askSchema = postSchema.discriminator('Ask', new mongoose.Schema({
    text: {
        type: String,
        required: true
    }
}));