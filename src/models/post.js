const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: '__type',
    collection: 'data'
};

const baseSchema = mongoose.model('Post', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
}, baseOptions));

export const urlSchema = baseSchema.discriminator('Url', new mongoose.Schema({
    url: {
        type: String,
        required: true
    }
}));

export const askSchema = baseSchema.discriminator('Ask', new mongoose.Schema({
    text: {
        type: String,
        required: true
    }
}));
