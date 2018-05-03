import {extractRootDomain} from "../utils/urlUtils";
import {timeSince} from "../utils/timeUtils";

const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: '__type',
    collection: 'data',
    timestamps: true
};

const postSchema = new mongoose.Schema({
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
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, baseOptions);

postSchema.virtual('timeSince').get(function () {
    return timeSince(this.createdAt);
});

let autoPopulate = function (next) {
    this.populate('owner');
    next();
};

postSchema.pre('findOne', autoPopulate);
postSchema.pre('find', autoPopulate);

const urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    tld: {
        type: String
    }
});

urlSchema.pre('save', function (next) {
    this.tld = extractRootDomain(this.url);
    next();
});

const askSchema = new mongoose.Schema({
    text: {
        type: String
    }
});

export const postModel = mongoose.model('Post', postSchema);
export const urlModel = postModel.discriminator('Url', urlSchema);
export const askModel = postModel.discriminator('Ask', askSchema);
