import {postModel} from "./post";

const mongoose = require('mongoose');

const baseOptions = {
    timestamps: true
};

const likeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
}, baseOptions);

// Before save, increment like count
likeSchema.pre('save', function (next) {
    if (!this.isNew) return next();
    postModel.findOne({
        _id: this.post
    }, function (err, post) {
        if (err) console.error(err);
        post.totalLikes += 1;
        post.save();
        next();
    });
});

// Before remove, increment like count
likeSchema.pre('remove', function (next) {
    postModel.findOne({
        _id: this.post
    }, function (err, post) {
        if (err) console.error(err);
        post.totalLikes -= 1;
        post.save();
        next();
    });
});

export const likeModel = mongoose.model('Like', likeSchema);