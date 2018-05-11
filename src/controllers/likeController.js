import {commentLikeModel, postLikeModel} from "../models/like";

export function likePost(userId, postId, done) {
    if (userId === undefined) return done(400);
    postLikeModel.count({
        owner: userId,
        post: postId
    }, function (err, count) {
        if (count > 0) return done(409);
        // Find like, if it not exists create new one
        postLikeModel.create({
            owner: userId,
            post: postId
        }, function (err, doc) {
            if (err) return done(err);
            done(null);
        });
    });
}

export function dislikePost(userId, postId, done) {
    if (userId === undefined) return done(400);
    postLikeModel.findOne({
        owner: userId,
        post: postId
    }, function (err, doc) {
        if (err) return done(err);
        if (doc === null) return done(404);
        doc.remove();
        done(null);
    });
}

export function likeComment(userId, postId, done) {
    if (userId === undefined) return done('Invalid user');
    commentLikeModel.count({
        owner: userId,
        comment: postId
    }, function (err, count) {
        if (count > 0) done('You already like this comment');
        else {
            // Find like, if it not exists create new one
            commentLikeModel.create({
                owner: userId,
                comment: postId
            }, function (err, doc) {
                if (err) {
                    console.error(err);
                    return done(err);
                }
                done(null);
            });
        }
    });
}

export function dislikeComment(userId, postId, done) {
    if (userId === undefined) return done('Invalid user');
    commentLikeModel.findOne({
        owner: userId,
        comment: postId
    }, function (err, doc) {
        if (err) {
            console.error(err);
            return done(err);
        } else if (doc !== null) doc.remove();
        done(null);
    });
}