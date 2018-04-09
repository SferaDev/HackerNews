import {getCookie, setCookie} from "../helpers/cookieManager";

const user = require('../models/user');

export function getCurrentUser(userId) {
    user.findOne({
        _id: userId
    }, function (err, user) {
        if (err) console.error(err);
        else return user;
    })
}

export function loginUser(username, password) {
    user.findOne({
        username: username
    }, function (err, user) {
        if (err) console.error(err);
        else if (user.comparePassword(password)) return user._id;
    })
}

export function registerUser(username, password) {
    new user({
        username: username,
        password: password
    }).save(function (err, user) {
        if (err) console.error(err);
        else return user._id;
    });
}