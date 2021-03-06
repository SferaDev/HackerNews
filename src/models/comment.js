import mongoose from "mongoose";
import idValidator from "mongoose-id-validator";

import {postModel} from "./post";
import {timeSince} from "../utils/timeUtils";
import {propertyFinder} from "../utils/magicUtils";

const baseOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            let publicProperties = propertyFinder(commentModel, 'public');
            for (let key in ret)
                if (ret.hasOwnProperty(key) && key !== '_id' && key !== 'replies' && key !== 'likes' &&
                    !publicProperties.includes(key)) delete ret[key];
        }
    }
};

const commentSchema = new mongoose.Schema({
    comment: {
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
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        public: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        final: true,
        public: true
    },
    date: {
        type: Date,
        default: Date.now,
        public: true
    },
    deleted: {
        type: Boolean,
        default: false,
        public: true
    },
    totalLikes: {
        type: Number,
        default: 0,
        public: true
    }
}, baseOptions);

commentSchema.virtual('timeSince').get(function () {
    return timeSince(this.createdAt);
});

commentSchema.virtual('replies', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment'
});

commentSchema.virtual('likes', {
    ref: 'CommentLike',
    localField: '_id',
    foreignField: 'comment'
});

let autoPopulate = function (next) {
    this.populate('replies');
    this.populate('likes', 'owner');
    this.populate('owner', '_id username');
    next();
};

commentSchema.pre('findOne', autoPopulate);
commentSchema.pre('find', autoPopulate);

commentSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

commentSchema.post('save', function (doc) {
    if (!this.wasNew) return;
    incrementComment(doc, 1);
});

commentSchema.post('remove', function (doc) {
    incrementComment(doc, -1);
});

function incrementComment(doc, incr) {
    postModel.findOne({
        _id: doc.post
    }, function (err, post) {
        if (err) console.error(err);
        post.totalComments += incr;
        post.save();
    });
}

commentSchema.statics.identifier = () => '_id';

commentSchema.methods.canEdit = function (userId) {
    return this.owner._id.toString() === userId.toString();
};

commentSchema.methods.executeDelete = function (next) {
    if (this.deleted) return next(false);
    this.deleted = true;
    this.comment = '<deleted>';
    this.save();
    next(true);
};

// Apply ObjectId reference validation
commentSchema.plugin(idValidator);

export const commentModel = mongoose.model('Comment', commentSchema);
