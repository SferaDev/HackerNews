const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");

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
        type: {type: Number, ref: 'User'}
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

postSchema.schema.plugin(autoIncrement.plugin, 'Post');