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
        type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
}, baseOptions));

const urlSchema = baseSchema.discriminator('Url', new mongoose.Schema({
    url: {
        type: String,
        required: true
    }
}));

const askSchema = baseSchema.discriminator('Url', new mongoose.Schema({
    text: {
        type: String,
        required: true
    }
}));

// Export Post model as module
module.exports = urlSchema;
module.exports = askSchema;
