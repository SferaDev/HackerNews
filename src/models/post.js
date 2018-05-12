import mongoose from "mongoose";
import idValidator from "mongoose-id-validator";

import {extractRootDomain} from "../utils/urlUtils";
import {timeSince} from "../utils/timeUtils";
import {commentModel} from "./comment";
import {propertyFinder} from "../utils/magicUtils";

const baseOptions = {
    discriminatorKey: '__type',
    collection: 'posts',
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            let publicProperties = propertyFinder(postModel, 'public');
            for (let key in ret)
                if (ret.hasOwnProperty(key) && key !== '_id' && key !== 'comments' && key !== '__type' &&
                    !publicProperties.includes(key)) delete ret[key];
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
    date: {
        type: Date,
        default: Date.now,
        public: true
    },
    text: {
        type: String,
        public: true
    },
    url: {
        type: String,
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

postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post'
});

let autoPopulate = function (next) {
    this.populate({
        path: 'comments',
        match: {parentComment: undefined}
    });
    this.populate('owner', '_id username');
    next();
};

postSchema.pre('findOne', autoPopulate);
postSchema.pre('find', autoPopulate);

const urlSchema = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
        required: true,
        editable: true,
        public: true,
        validate: {
            validator: function (v) {
                let urlRegexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                return urlRegexp.test(v);
            },
            message: 'Invalid url'
        }
    }
});

urlSchema.pre('save', function (next) {
    this.tld = extractRootDomain(this.url);
    next();
});

const askSchema = new mongoose.Schema({
    text: {
        type: String,
        editable: true,
        public: true
    }
});

postSchema.statics.identifier = () => '_id';

postSchema.methods.canEdit = function (userId) {
    return this.owner._id.toString() === userId.toString();
};

postSchema.methods.executeDelete = function (next) {
    this.remove();
    commentModel.remove({post: this._id}, function (err, elements) {
        if (err) console.error(err);
    });
    next(true);
};

// Apply ObjectId reference validation
postSchema.plugin(idValidator);

export const postModel = mongoose.model('Post', postSchema);
export const urlModel = postModel.discriminator('Url', urlSchema);
export const askModel = postModel.discriminator('Ask', askSchema);
