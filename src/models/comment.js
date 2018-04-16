import {postSchema} from "./post";

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
        type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    },
    post: {
        type: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
    }
}, baseOptions);

// Before save, increment comment count
commentSchema.pre('save', function (next) {
    if (!this.isModified('_id')) return next();
    postSchema.findOne({
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
    postSchema.findOne({
        _id: this.post
    }, function (err, post) {
        if (err) console.error(err);
        post.totalComments -= 1;
        post.save();
    });
    next();
});

export const commentModel = mongoose.model('Comment', commentSchema);