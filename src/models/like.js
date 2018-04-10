import {postSchema} from "./post";

const mongoose = require('mongoose');

const baseOptions = {
    timestamps: true
};

export const likeSchema = mongoose.model('Like', new mongoose.Schema({
    owner: {
        type: {type: Number, ref: 'User'}
    },
    post: {
        type: {type: Number, ref: 'Post'}
    }
}, baseOptions));

// Before save, increment like count
likeSchema.pre('save', function(next) {
    if (!this.isModified('_id')) return next();
    postSchema.findOne({
        _id: this.post
    }, function (err, post) {
        if (err) console.error(err);
        post.totalLikes += 1;
        post.save();
    });
    next();
});

// Before remove, increment like count
likeSchema.pre('remove', function(next) {
    postSchema.findOne({
        _id: this.post
    }, function (err, post) {
        if (err) console.error(err);
        post.totalLikes -= 1;
        post.save();
    });
    next();
});