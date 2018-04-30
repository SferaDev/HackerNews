import {commentModel} from "../models/comment";

export function insertComment(userId, postId, text, parentComment, done) {
    let fields = {
        comment: text,
        owner: userId,
        post: postId
    };

    if (parentComment !== '')
        fields.parentComment = parentComment;
    new commentModel(fields)
        .save(function (err, user) {
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

export function getCommentsByPostId(postId, done) {
    commentModel.find({post: postId}).populate('owner').exec(function (err, elements) {
        if (err) done('{}');
        else done(elements);
    });
}

export function getCommentById(commentId, done)
{
    commentModel.findOne({_id: commentId}).populate('owner').exec(function (err, comment)
    {
        if (err) console.error(err);
        else done(comment);
    });
}