const user = require('../models/user');

export function getUser(userId, next) {
    user.findOne({
        _id: userId
    }, function (err, user) {
        if (err) {
            console.error(err);
            next(err);
        } else next(null, user);
    })
}

export function loginUser(username, password, next) {
    user.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            console.error(err);
            next(err);
        } else if (user == null) {
            next(null, null);
        } else if (user.comparePassword(password))
            next(null, user._id);
    })
}

export function registerUser(username, password, next) {
    new user({
        username: username,
        password: password
    }).save(function (err, user) {
        if (err) {
            console.error(err);
            next(err);
        } else next(null, user._id);
    });
}