import {askSchema, postSchema, urlSchema} from "../models/post";

export function insertUrlPost(userId, title, url) {
    new urlSchema({
        title: title,
        url: url,
        owner: userId
    }).save(function (error, element) {
        if (error) console.error(error);
    });
}

export function insertAskPost(userId, title, text) {
    new askSchema({
        title: title,
        text: text,
        owner: userId
    }).save(function (error, element) {
        if (error) console.error(error);
    });
}

export function getAllPosts(next) {
    postSchema.find({}).populate('owner').exec(function (err, elements) {
        if (err) next('[]');
        else next(elements);
    })
}

export function getPostById(postId, next) {
    postSchema.findOne({_id: postId}).populate('owner').exec(function (err, element) {
        if (err) next('{}');
        else next(element);
    })
}

export function getPostByTld(postTld, next) {
    postSchema.find({tld: postTld}).populate('owner').exec(function (err, elements) {
        if (err) next('[]');
        else next(elements);
    })
}