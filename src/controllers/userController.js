const jwt = require('jsonwebtoken');
const user = require('../models/user');

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'randomTokenSecret';

export function getUser(userId, next) {
    user.findOne({
        _id: userId
    }, function (err, user) {
        if (err) {
            console.error(err);
            next(null);
        } else next(user);
    })
}

export function loginUser(username, password, next) {
    user.findOne({
        username: username
    }, function (err, user) {
        if (err || user == null) {
            console.error(err);
            next(null);
        } else if (user.comparePassword(password))
            next(jwt.sign({
                userId: user._id,
                username: user.username
            }, TOKEN_SECRET, {expiresIn: 60 * 60 * 24 * 365}));
    })
}

export function registerUser(username, password, next) {
    new user({
        username: username,
        password: password
    }).save(function (err, user) {
        if (err) {
            console.error(err);
            next(null);
        } else next(jwt.sign({
            userId: user._id,
            username: user.username
        }, TOKEN_SECRET, {expiresIn: 60 * 60 * 24 * 365}));
    });
}

export function validateUser(token, next) {
    if (token === undefined) return next('{}');
    jwt.verify(token, TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.error(err);
            next(null);
        } else {
            next(decoded);
        }
    });
}