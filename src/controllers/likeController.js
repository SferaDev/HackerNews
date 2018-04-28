import {likeModel} from "../models/like";

export function likePost(userId, postId, done) {
    likeModel.count({
        owner: userId,
        post: postId
    }, function (err, count) {
        if (count > 0) done();
        else {
            // Find like, if it not exists create new one
            likeModel.create({
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
    likeModel.findOne({
        owner: userId,
        post: postId
    }, function (err, doc) {
        if (err) console.error(err);
        else if (doc !== null) doc.remove();
        done();
    });
}