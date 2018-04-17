import {postSchema} from "./post";

const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: '__type',
    collection: 'data',
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
    points: {
        type: Number,
        default: 0
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

export const replySchema = commentSchema.discriminator('Reply', new mongoose.Schema({
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }
}));

export const commentModel = mongoose.model('Comment', commentSchema);