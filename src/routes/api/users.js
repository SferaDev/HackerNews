import express from "express";

import * as httpCodes from "../../utils/httpCodes";
import {userModel} from '../../models/user';
import {errorCallback} from "../api";

export const usersApiRouter = express.Router();

// GET /api/users
usersApiRouter.get('/', function (req, res) {
    userModel.find({}, {
        _id: 0,
        username: 1,
        githubId: 1,
        karma: 1,
        about: 1,
        email: 1,
        createdAt: 1
    }, function (err, users) {
        if (err) return errorCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
        res.status(httpCodes.STATUS_OK).send(users);
    });
});

// POST /api/users
usersApiRouter.post('/', function (req, res) {
    // TODO: Create new user (if it already exists error out httpCodes.CONFLICT)
});

// GET /api/users/:username
usersApiRouter.get('/:username', function (req, res) {
    userModel.find({username: req.params.username}, {
        _id: 0,
        username: 1,
        githubId: 1,
        karma: 1,
        about: 1,
        email: 1,
        createdAt: 1
    }, function (err, user) {
        if (err) return errorCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
        else res.status(httpCodes.STATUS_OK).send(user);
    });
});

// PUT /api/users/:username
usersApiRouter.put('/:username', function (req, res) {
    // TODO: Update user (admins can update any user, user can only update own user)
});

// DELETE /api/users/:username
usersApiRouter.delete('/:username', function (req, res) {
    if (req.user.isAdmin) userModel.delete({username: req.params.username},
        err => errorCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error'));
    else if (req.user.username === req.params.username) req.user.delete();
    else return errorCallback(res, httpCodes.STATUS_FORBIDDEN, 'You can only delete your own user');
});