import {commentLikeModel, likeModel, postLikeModel} from "../models/like";

export function likePost(userId, postId, done) {
    if (userId === undefined) return done();
    postLikeModel.count({
        owner: userId,
        post: postId
    }, function (err, count) {
        if (count > 0) done();
        else {
            // Find like, if it not exists create new one
            postLikeModel.create({
                owner: userId,
                post: postId
            }, function (err, doc) {
                if (err) console.error(err);
                done();
            });
        }
    });
}

export function dislikePost(userId, postId, done) {
    if (userId === undefined) return done();
    postLikeModel.findOne({
        owner: userId,
        post: postId
    }, function (err, doc) {
        if (err) console.error(err);
        else if (doc !== null) doc.remove();
        done();
    });
}

export function likeComment(userId, postId, done) {
    if (userId === undefined) return done();
    commentLikeModel.count({
        owner: userId,
        comment: postId
    }, function (err, count) {
        if (count > 0) done();
        else {
            // Find like, if it not exists create new one
            commentLikeModel.create({
                owner: userId,
                comment: postId
            }, function (err, doc) {
                if (err) console.error(err);
                done();
            });
        }
    });
}

export function dislikeComment(userId, postId, done) {
    if (userId === undefined) return done();
    commentLikeModel.findOne({
        owner: userId,
        comment: postId
    }, function (err, doc) {
        if (err) console.error(err);
        else if (doc !== null) doc.remove();
        done();
    });
}