const jwt = require('jsonwebtoken');
const user = require('../models/user');

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'randomTokenSecret';

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
            next(null, jwt.sign({
                userId: user._id,
                username: user.username
            }, TOKEN_SECRET, { expiresIn: 60 * 60 * 24 * 365 }));
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
        } else next(null, jwt.sign({
            userId: user._id,
            username: user.username
        }, TOKEN_SECRET, { expiresIn: 60 * 60 * 24 * 365 }));
    });
}

export function validateUser(token, next) {
    jwt.verify(token, TOKEN_SECRET, function(err, decoded) {
        if (err) console.error(err);
        else {
            next(decoded);
        }
    });
}