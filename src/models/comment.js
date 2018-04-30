import mongoose from "mongoose";
import {postModel} from "./post";
import {timeSince} from "../utils/timeUtils";

const baseOptions = {
    timestamps: true
};

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
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

let autoPopulate = function (next) {
    this.populate('replies');
    this.populate('owner');
    next();
};

commentSchema.pre('findOne', autoPopulate);
commentSchema.pre('find', autoPopulate);

// Before save, increment comment count
commentSchema.pre('save', function (next) {
    if (!this.isModified('_id')) return next();
    postModel.findOne({
        _id: this.post
    }, function (err, post) {
        if (err) console.error(err);
        post.totalComments += 1;
        post.save();
    });
    next();
});

// Before save, increment comment count
commentSchema.pre('remove', function (next) {
    postModel.findOne({
        _id: this.post
    }, function (err, post) {
        if (err) console.error(err);
        post.totalComments -= 1;
        post.save();
    });
    next();
});

export const commentModel = mongoose.model('Comment', commentSchema);
