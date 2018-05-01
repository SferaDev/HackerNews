import {askModel, postModel, urlModel} from "../models/post";
import {getUserByUsername} from "./userController";
import {commentModel} from "../models/comment";

export function insertUrlPost(userId, title, url, done) {
    if (userId === undefined) return done();
    new urlModel({
        title: title,
        url: url,
        owner: userId
    }).save(function (err, element) {
        if (err) console.error(err);
        done(element);
    });
}

export function insertAskPost(userId, title, text, done) {
    if (userId === undefined) return done();
    new askModel({
        title: title,
        text: text,
        owner: userId
    }).save(function (err, element) {
        if (err) console.error(err);
        done(element);
    });
}

export function deletePost(userId, postId, done) {
    postModel.findOne({_id: postId}, function (err, doc) {
        if (err) console.error(err);
        else if (doc.owner._id.toString() === userId.toString()) {
            doc.remove();
            commentModel.remove({post: postId}, function (err2, elements) {
                if (err2) console.error(err2);
                else done();
            })
        } else done();
    })
}

export function getAllPosts(next) {
    postModel.find({}).exec(function (err, elements) {
        if (err) next([]);
        else next(elements);
    });
}

export function getPostById(postId, next) {
    postModel.findOne({_id: postId}).exec(function (err, element) {
        if (err) next({});
        else next(element);
    });
}

export function getPostsByTld(postTld, next) {
    postModel.find({tld: postTld}).exec(function (err, elements) {
        if (err) next([]);
        else next(elements);
    });
}

export function getPostsByOwner(username, next) {
    getUserByUsername(username, function (user) {
        if (user !== null) {
            postModel.find({owner: user._id}).exec(function (err, elements) {
                if (err) next([]);
                else next(elements);
            })
        } else next([]);
    });
}