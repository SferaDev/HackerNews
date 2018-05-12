import mongoose from "mongoose";
import idValidator from "mongoose-id-validator";

import {postModel} from "./post";
import {commentModel} from "./comment";
import {propertyFinder} from "../utils/magicUtils";
import {userModel} from "./user";

const baseOptions = {
    discriminatorKey: '__type',
    collection: 'likes',
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            let publicProperties = propertyFinder(likeModel, 'public');
            for (let key in ret)
                if (ret.hasOwnProperty(key) && !publicProperties.includes(key)) delete ret[key];
        }
    }
};

const likeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, baseOptions);

const postLikeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
});

postLikeSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

postLikeSchema.post('save', function (doc) {
    if (!this.wasNew) return;
    incrementPostLikeAndKarma(doc, 1);
});

postLikeSchema.post('remove', function (doc) {
    incrementPostLikeAndKarma(doc, -1);
});

function incrementPostLikeAndKarma(doc, incr) {
    postModel.findOne({_id: doc.post}).exec(function (err, post) {
        if (err || post === null) return console.error(err);
        post.totalLikes += incr;
        post.save();
        userModel.findOne({_id: post.owner._id}).exec(function (err, owner) {
            if (err || owner === null) return console.error(err);
            owner.karma += incr;
            owner.save();
        });
    });
}

const commentLikeSchema = new mongoose.Schema({
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
});

commentLikeSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

commentLikeSchema.post('save', function (doc) {
    if (!this.wasNew) return;
    incrementCommentLike(doc, 1);
});

commentLikeSchema.post('remove', function (doc) {
    incrementCommentLike(doc, -1);
});

function incrementCommentLike(doc, incr) {
    commentModel.findOne({
        _id: doc.comment
    }).exec(function (err, comment) {
        if (err || comment === null) return console.error(err);
        comment.totalLikes += incr;
        comment.save();
    });
}

likeSchema.statics.identifier = () => '_id';

likeSchema.methods.canEdit = function (userId) {
    return this.owner.toString() === userId.toString();
};

likeSchema.methods.executeDelete = function (next) {
    this.remove();
    next(true);
};

// Apply ObjectId reference validation
likeSchema.plugin(idValidator);
postLikeSchema.plugin(idValidator);
commentLikeSchema.plugin(idValidator);

export const likeModel = mongoose.model('Like', likeSchema);
export const postLikeModel = likeModel.discriminator('PostLike', postLikeSchema);
export const commentLikeModel = likeModel.discriminator('CommentLike', commentLikeSchema);