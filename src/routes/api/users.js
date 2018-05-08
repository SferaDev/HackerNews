import express from "express";

import * as httpCodes from "../../utils/httpCodes";
import * as userController from "../../controllers/userController";
import {userModel} from '../../models/user';
import {messageCallback} from "../api";

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
        if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
        res.status(httpCodes.STATUS_OK).send(users);
    });
});

// POST /api/users
usersApiRouter.post('/', function (req, res) {
    let attributes = {};
    for (let key in userModel.schema.paths) {
        if (userModel.schema.paths.hasOwnProperty(key)) {
            let value = userModel.schema.paths[key];
            if (value.isRequired) {
                if (req.body[key]) attributes[key] = req.body[key];
                else return res.status(httpCodes.STATUS_BAD_REQUEST).send({message: "Missing parameter " + key});
            }
        }
    }
    userModel.count({nif: req.body.nif}, function (err, count) {
        if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
        if (count > 0) return messageCallback(res, httpCodes.STATUS_CONFLICT, 'User already exists');
        userModel.create(attributes, function (err, user) {
            if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
            return messageCallback(res, httpCodes.STATUS_CREATED, 'User created');
        })
    })
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
        if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
        else res.status(httpCodes.STATUS_OK).send(user);
    });
});

// PUT /api/users/:username
usersApiRouter.put('/:username', function (req, res) {
    if (req.user.isAdmin || req.user.username === req.params.username) {
        userController.getUserByUsername(req.params.username, function(err, user) {
            userController.updateUser(user._id, function (err) {
                if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
                return messageCallback(res, httpCodes.STATUS_OK, 'Ok');
            });
        });
    } else return messageCallback(res, httpCodes.STATUS_FORBIDDEN, 'You can only edit your own user');
});

// DELETE /api/users/:username
usersApiRouter.delete('/:username', function (req, res) {
    if (req.user.isAdmin || req.user.username === req.params.username) {
        userController.getUserByUsername(req.params.username, function(err, user) {
            userController.deleteUser(user._id, function (err) {
                if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
                return messageCallback(res, httpCodes.STATUS_OK, 'Ok');
            });
        });
    } else return messageCallback(res, httpCodes.STATUS_FORBIDDEN, 'You can only delete your own user');
});
