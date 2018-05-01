import {getUserByUsername} from "./userController";
import {favouriteModel} from "../models/favourite";

export function insertFavourite(userId, postId, done) {
    favouriteModel.findOneOrCreate({
        user: userId,
        post: postId
    }, function (error, element) {
        if (error) console.error(error);
        done(element);
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