import {urlSchema, askSchema} from "../models/post";
import {getCurrentUser} from "./userController";

export function insertUrlPost(userId, title, url) {
    new urlSchema({
        title: title,
        url: url,
        owner: userId
    }).save(function (error) {
        if (error) return false;
    });
    return true;
}

export function insertAskPost(userId, title, text) {
    new askSchema({
        title: title,
        text: text,
        owner: userId
    }).save(function (error) {
        if (error) return false;
    });
    return true;
}