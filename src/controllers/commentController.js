import {commentModel} from "../models/comment";

export function insertComment(userId, postId, text, parentComment, done) {
    new commentModel({
        comment: text,
        owner: userId,
        post: postId,
        parentComment: parentComment
    }).save(function (err, user) {
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