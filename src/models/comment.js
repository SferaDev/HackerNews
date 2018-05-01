import mongoose from "mongoose";
import {postModel} from "./post";
import {timeSince} from "../utils/timeUtils";

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
        ref: 'Comment'
    }
}, baseOptions);

commentSchema.virtual('timeSince').get(function () {
    return timeSince(this.createdAt);
});

commentSchema.virtual('replies', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment'
});

let autoPopulate = function (next) {
    this.populate('replies');
    this.populate('owner');
    next();
};

commentSchema.pre('findOne', autoPopulate);
commentSchema.pre('find', autoPopulate);

commentSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

commentSchema.post('save', function (doc) {
    if (!this.wasNew) return;
    incrementComment(doc, 1);
});

commentSchema.post('remove', function (doc) {
    incrementComment(doc, -1);
});

function incrementComment(doc, incr) {
    postModel.findOne({
        _id: doc.post
    }, function (err, post) {
        if (err) console.error(err);
        post.totalComments += incr;
        post.save();
    });
}

export const commentModel = mongoose.model('Comment', commentSchema);
