import {askModel, postModel, urlModel} from "../models/post";
import {getUserByUsername} from "./userController";

export function insertUrlPost(userId, title, url, done) {
    new urlModel({
        title: title,
        url: url,
        owner: userId
    }).save(function (error, element) {
        if (error) console.error(error);
        done(element);
    });
}

export function insertAskPost(userId, title, text, done) {
    new askModel({
        title: title,
        text: text,
        owner: userId
    }).save(function (error, element) {
        if (error) console.error(error);
        done(element);
    });
}

export function getAllPosts(next) {
    postModel.find({}).populate('owner').exec(function (err, elements) {
        if (err) next('[]');
        else next(elements);
    })
}

export function getPostById(postId, next) {
    postModel.findOne({_id: postId}).populate('owner').exec(function (err, element) {
        if (err) next('{}');
        else next(element);
    })
}

export function getPostsByTld(postTld, next) {
    postModel.find({tld: postTld}).populate('owner').exec(function (err, elements) {
        if (err) next('[]');
        else next(elements);
    })
}

export function getPostsByOwner(username, next) {
    getUserByUsername(username, function (user) {
        if (user !== null) {
            postModel.find({owner: user._id}).populate('owner').exec(function (err, elements) {
                if (err) next('[]');
                else next(elements);
            })
        } else next('[]');
    })
}