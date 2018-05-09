import {extractRootDomain} from "../utils/urlUtils";
import {timeSince} from "../utils/timeUtils";
import {commentModel} from "./comment";
import {propertyFinder} from "../utils/magicUtils";

const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: '__type',
    collection: 'posts',
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            let publicProperties = propertyFinder(postModel, 'public');
            for (let key in ret)
                if (ret.hasOwnProperty(key) && key !== '_id' && !publicProperties.includes(key)) delete ret[key];
        }
    }
};

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        editable: true,
        public: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        public: true
    },
    totalComments: {
        type: Number,
        default: 0,
        public: true
    },
    totalLikes: {
        type: Number,
        default: 0,
        public: true
    },
    deleted: {
        type: Boolean,
        default: false,
        public: true
    },
    text: {
        type: String,
        editable: true,
        public: true
    },
    url: {
        type: String,
        editable: true,
        public: true
    },
    tld: {
        type: String,
        public: true
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
        editable: true,
        public: true
    }
});

urlSchema.pre('save', function (next) {
    this.tld = extractRootDomain(this.url);
    next();
});

const askSchema = new mongoose.Schema({});

postSchema.statics.identifier = () => '_id';

postSchema.methods.canEdit = function (userId) {
    return this.owner._id.toString() === userId.toString();
};

postSchema.methods.executeDelete = function () {
    this.remove();
    commentModel.remove({post: this._id}, function (err, elements) {
        if (err) console.error(err);
    });
};

export const postModel = mongoose.model('Post', postSchema);
export const urlModel = postModel.discriminator('Url', urlSchema);
export const askModel = postModel.discriminator('Ask', askSchema);
