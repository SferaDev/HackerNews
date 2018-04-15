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