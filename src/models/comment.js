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
        type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    },
    post: {
        type: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
    }
}, baseOptions));

// TODO: Might not work because is upon mongoose model instead of schema
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

// TODO: Might not work because is upon mongoose model instead of schema
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