import express from "express";

import {modelCreate, modelDelete, modelGetAll, modelGetOne, modelUpdate} from "./base";
import {userModel} from '../../models/user';

export const usersApiRouter = express.Router();

// GET /api/users
usersApiRouter.get('/', function (req, res) {
    modelGetAll(userModel, req, res);
});

// POST /api/users
usersApiRouter.post('/', function (req, res) {
    modelCreate(userModel, req, res);
});

// GET /api/users/:element
usersApiRouter.get('/:element', function (req, res) {
    modelGetOne(userModel, req, res);
});

// PUT /api/users/:element
usersApiRouter.put('/:element', function (req, res) {
    modelUpdate(userModel, req, res);
});

// DELETE /api/users/:element
usersApiRouter.delete('/:element', function (req, res) {
    modelDelete(userModel, req, res);
});

// GET /api/users/:element/favourites
usersApiRouter.get('/:element/favourites', function (req, res) {
    // TODO
});

// POST /api/users/:element/favourites
usersApiRouter.post('/:element/favourites', function (req, res) {
    // TODO
});
