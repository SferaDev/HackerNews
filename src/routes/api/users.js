import express from "express";

import {modelCreate, modelDelete, modelGetAll, modelGetOne, modelUpdate} from "./base";
import {userModel} from '../../models/user';
import {commentModel} from "../../models/comment";
import {messageCallback} from "../api";
import * as userController from "../../controllers/userController";
import * as httpCodes from "../../utils/httpCodes";

export const usersApiRouter = express.Router();

// GET /api/users
usersApiRouter.get('/', function (req, res) {
    modelGetAll(userModel, {}, req, res);
});

// POST /api/users
usersApiRouter.post('/', function (req, res) {
    messageCallback(res, httpCodes.STATUS_FORBIDDEN, 'User creation is not allowed via API')
});

// GET /api/users/:element
usersApiRouter.get('/:element', function (req, res) {
    modelGetOne(userModel, req, res);
});

// GET /api/users/:element/comments
usersApiRouter.get('/:element/comments', function (req, res) {
    userController.getUserByUsername(req.params.element, function (user) {
        if (user === null) return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'User not found');
        modelGetAll(commentModel, {owner: user._id}, req, res);
    });
});

// PUT /api/users/:element
usersApiRouter.put('/:element', function (req, res) {
    modelUpdate(userModel, req, res);
});

// DELETE /api/users/:element
usersApiRouter.delete('/:element', function (req, res) {
    modelDelete(userModel, req, res);
});