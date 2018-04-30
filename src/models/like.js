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
    this.wasNew = this.isNew;
    next();
});

likeSchema.post('save', function (doc) {
    if (!this.wasNew) return;
    incrementLikeAndKarma(doc, 1);
});

// Before remove, increment like count
likeSchema.post('remove', function (doc) {
    incrementLikeAndKarma(doc, -1);
});

function incrementLikeAndKarma(doc, incr) {
    postModel.findOne({
        _id: doc.post
    }).populate('owner').exec(function (err, post) {
        if (err || post === null) return console.error(err);
        post.totalLikes += incr;
        post.save();
        post.owner.karma += incr;
        post.owner.save();
    });
}

export const likeModel = mongoose.model('Like', likeSchema);