import {urlSchema, askSchema} from "../models/post";

export function insertUrlPost(userId, title, url) {
    new urlSchema({
        title: title,
        url: url,
        owner: userId
    }).save(function (error) {
        if (error) console.error(error);
    });
}

export function insertAskPost(userId, title, text) {
    new askSchema({
        title: title,
        text: text,
        owner: userId
    }).save(function (error) {
        if (error) console.error(error);
    });
}