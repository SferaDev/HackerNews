import {postSchema} from "./post";

const mongoose = require('mongoose');

const baseOptions = {
    timestamps: true
};

export const commentSchema = mongoose.model('Comment', new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    owner: {
        type: {type: Number, ref: 'User'}
    },
    post: {
        type: {type: Number, ref: 'Post'}
    }
}, baseOptions));

// Before save, increment comment count
commentSchema.pre('save', function(next) {
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
commentSchema.pre('remove', function(next) {
    postSchema.findOne({
        _id: this.post
    }, function (err, post) {
        if (err) console.error(err);
        post.totalComments -= 1;
        post.save();
    });
    next();
});