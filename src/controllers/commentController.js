import {commentModel} from "../models/comment";
import {getUserByUsername} from "./userController";
import {getPostById} from "./postController";

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

export function deleteComment(userId, commentId, done) {
    commentModel.findOne({_id: commentId}, function (err, comment) {
        if (err) return console.error(err);
        if (comment.owner._id.toString() === userId.toString()) {
            comment.deleted = true;
            comment.save();
        }
        done();
    });
}

export function getCommentsByPost(postId, done) {
    commentModel.find({
        post: postId,
        parentComment: undefined
    }).exec(function (err, elements) {
        if (err) done([]);
        else done(elements);
    });
}

export function getCommentById(commentId, done) {
    commentModel.findOne({_id: commentId}).exec(function (err, comment) {
        if (err) console.error(err);
        else done(comment);
    });
}

export function getCommentsByOwner(username, done) {
    getUserByUsername(username, function (owner) {
        commentModel.find({owner: owner, deleted: false}).populate('post').exec(function (err, elements) {
            if (err) done([]);
            else done(elements);
        });
    });
}

export function getAllComments(done) {
    commentModel.find({deleted: false}).populate('post').exec(function (err, elements) {
        if (err) done([]);
        else done(elements);
    });
}

export function updateComment(commentId, text, done)
{
    getCommentById(commentId, function (comment)
    {
        comment.comment = text;

        comment.save(function (err, updated)
        {
            if (err) console.error(err);
            else done();
        });
    });
}