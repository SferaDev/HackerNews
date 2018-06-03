import github from "octonode";
import request from "request";
import hat from "hat";

import {userModel} from "../models/user";

export function getUser(userId, next) {
    userModel.findOne({
        _id: userId
    }, function (err, user) {
        if (err) {
            console.error(err);
            next(null);
        } else next(user);
    })
}

export function getUserByUsername(username, next) {
    userModel.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            console.error(err);
            next(null);
        } else next(user);
    })
}

export function loginUser(username, password, next) {
    userModel.findOne({
        username: username
    }, function (err, user) {
        if (err || user == null) {
            console.error(err);
            next(null);
        } else if (user.comparePassword(password)) {
            next(user);
        }
    })
}

export function registerUser(username, password, next) {
    new userModel({
        username: username,
        password: password,
        githubId: username
    }).save(function (err, user) {
        if (err) {
            console.error(err);
            next(null);
        } else next(user._id);
    });
}

export function regenerateAPIKey(userId, next) {
    userModel.findOne({
        _id: userId
    }, function (err, user) {
        if (err || user == null) console.error(err);
        else {
            user.apiKey = hat();
            user.save();
            next();
        }
    })
}

export function loginOauthUser(oauthCode, next) {
    request.post({
        url: 'https://github.com/login/oauth/access_token?client_id=' + process.env.GITHUB_WEBAPP_CLIENT_ID +
        '&client_secret=' + process.env.GITHUB_WEBAPP_CLIENT_SECRET + '&code=' + oauthCode,
        headers: { 'Accept': 'application/json' }
    }, function (err, response, body) {
        body = JSON.parse(body);
        let oauthToken = body['access_token'];
        if (oauthToken === undefined) return next(body['error_description']);
        let client = github.client(oauthToken);
        client.me().info(function (err1, data) {
            if (err1 || data === undefined) return next(err1);
            userModel.findOne({githubId: data.id}, function (err2, user) {
                if (err2) return next(err2);
                if (user === null) {
                    userModel.create({
                        githubId: data.id,
                        username: data.login,
                        fullName: data.name,
                        picture: data.avatar_url
                    }, function (err3, newUser) {
                        if (err3) return next(err3);
                        next(null, newUser.apiKey);
                    });
                } else next(null, user.apiKey);
            });
        });
    });
}

export function updateUser(userid, about, next) {
    let fields = {};
    if (about !== '') fields.about = about;
    userModel.update({_id: userid}, fields, function (err, res) {
        if (err) {
            console.error(err);
            return next(err);
        } else next(null);
    });
}

export function deleteUser(userid, next) {
    userModel.remove({_id: userid}, function (err, res) {
        if (err) {
            console.error(err);
            return next(err);
        } else next(null);
    });
}
