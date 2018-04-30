import {commentModel} from "../models/comment";
import {getUserByUsername} from "./userController";

export function insertComment(userId, postId, text, parentComment, done) {
    let fields = {
        comment: text,
        owner: userId,
        post: postId
    };
    if (parentComment !== '') fields.parentComment = parentComment;
    new commentModel(fields).save(function (err, user) {
        if (err) console.error(err);
        done();
    });
}

export function removeComment(commentId, done) {
    commentModel.remove({_id: commentId}, function (err) {
        if (err) console.error(err);
        done();
    });
}

export function getCommentsByPost(postId, done) {
    commentModel.find({post: postId, parentComment: undefined}).populate('owner').populate('replies').exec(function (err, elements) {
        if (err) done('{}');
        else done(elements);
    });
}

export function getCommentById(commentId, done) {
    commentModel.findOne({_id: commentId}).populate('owner').exec(function (err, comment) {
        if (err) console.error(err);
        else done(comment);
    });
}

export function getCommentsByOwner(username, done)
{
    getUserByUsername(username, function (owner)
    {
        commentModel.find({owner: owner})
            .populate('owner')
            .populate('post').exec(function (err, elements)
        {
            if (err) done('{}');
            else done(elements);
        });
    });
}