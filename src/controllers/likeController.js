import {likeModel} from "../models/like";

export function likePost(userId, postId, done) {
    // Find like, if it not exists create new one
    likeModel.findOneAndUpdate({
        owner: userId,
        post: postId
    }, {}, {upsert: true}, function (err, doc) {
        if (err) console.error(err);
        done();
    });
}

export function dislikePost(userId, postId, done) {
    // Remove all likes of userId, postId
    likeModel.remove({
        owner: userId,
        post: postId
    }, function (err) {
        if (err) console.error(err);
        done();
    })
}

export function getLikesByUser(userId, done) {
    // Find all post likes
    likeModel.find({
        owner: userId,
    }, {_id: 0, post: 1}, function (err, likedPosts) {
        if (err) {
            console.error(err);
            likedPosts = [];
        }
        done(likedPosts);
    });
}