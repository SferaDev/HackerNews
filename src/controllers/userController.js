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
            next(user._id);
        } else {
            // TODO: Passwords didn't match
        }
    })
}

export function registerUser(username, password, next) {
    new userModel({
        username: username,
        password: password
    }).save(function (err, user) {
        // TODO: User already exists shouldn't throw an error
        if (err) {
            console.error(err);
            next(null);
        } else next(user._id);
    });
}