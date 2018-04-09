import {urlSchema, askSchema} from "../models/post";
import {getCurrentUser} from "./userController";

export function insertUrlPost(title, url) {
    new urlSchema({
        title: title,
        url: url,
        owner: getCurrentUser()._id
    }).save(function (error) {
        if (error) return false;
    });
    return true;
}

export function insertAskPost(title, text) {
    new askSchema({
        title: title,
        text: text,
        owner: getCurrentUser()._id
    }).save(function (error) {
        if (error) return false;
    });
    return true;
}