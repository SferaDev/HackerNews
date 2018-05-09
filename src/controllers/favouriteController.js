import {getUserByUsername} from "./userController";
import {favouriteModel} from "../models/favourite";

export function insertFavourite(userId, postId, done) {
    favouriteModel.findOneOrCreate({
        user: userId,
        post: postId
    }, function (error, element) {
        if (error) console.error(error);
        done(null);
    });
}

export function removeFavourite(userId, postId, done) {
    if (userId === undefined) return done();
    favouriteModel.findOne({
        user: userId,
        post: postId
    }, function (err, doc) {
        if (err) {
            console.error(err);
            return done(err);
        } else if (doc !== null) doc.remove();
        done(null);
    });
}

export function getFavouritePosts(username, next) {
    getUserByUsername(username, function (user) {
        if (user !== null) {
            favouriteModel.find({user: user._id}, {post: 1, _id: 0}).exec(function (err, elements) {
                if (err) next([]);
                else {
                    let result = [];
                    elements.forEach(element => result.push(element['post']));
                    next(result);
                }
            })
        } else next([]);
    });
}