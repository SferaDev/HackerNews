import {likeSchema} from "../models/like";
import {incrementLike} from "./postController";

export function likePost(userId, postId) {
    likeExists(userId, postId, function (results) {
        if (results.length === 0) {
            new likeSchema({
                owner: userId,
                post: postId
            }).save(function (error) {
                if (error) console.error(error);
            });
        }
    });
}

export function dislikePost(userId, postId) {
    likeExists(userId, postId, function (results) {
        results.forEach(function (element) {
            element.remove();
        })
    });
}

function likeExists(userId, postId, next) {
    likeSchema.find({
        owner: userId,
        post: postId
    }, function (err, results) {
        console.log(results);
        if (err) console.error(err);
        else next(results);
    })
}