import {postSchema} from "./post";

const mongoose = require('mongoose');

const baseOptions = {
    timestamps: true
};

const likeSchema = new mongoose.Schema({
    owner: {
        type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    },
    post: {
        type: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
    }
}, baseOptions);

// Before save, increment like count
likeSchema.pre('save', function (next) {
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
likeSchema.pre('remove', function (next) {
    postSchema.findOne({
        _id: this.post
    }, function (err, post) {
        if (err) console.error(err);
        post.totalLikes -= 1;
        post.save();
    });
    next();
});

export const likeModel = mongoose.model('Like', likeSchema);