import {postModel} from "./post";

const mongoose = require('mongoose');

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
        ref: 'Comment',
        default: ''
    }
}, baseOptions);

commentSchema.virtual('replies').get(function () {
    this.find({parentComment: this._id}, function (err, elements) {
        if (err) console.error(err);
        else return elements;
    });
    return null;
});

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