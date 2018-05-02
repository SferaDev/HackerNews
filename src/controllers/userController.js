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

export function updateUser(userid, about, next) {
    let fields = {};
    if (about !== '') fields.about = about;
    userModel.update({_id: userid}, fields, function (err, res) {
        if (err) console.error(err);
        next(null);
    });
}
