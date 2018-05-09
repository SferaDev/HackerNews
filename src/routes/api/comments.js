import express from "express";

import {modelCreate, modelDelete, modelGetAll, modelGetOne, modelUpdate} from "./base";
import {commentModel} from '../../models/comment';

export const commentsApiRouter = express.Router();

// GET /api/comments
commentsApiRouter.get('/', function (req, res) {
    modelGetAll(commentModel, req, res);
});

// POST /api/comments
commentsApiRouter.post('/', function (req, res) {
    modelCreate(commentModel, req, res);
});

// GET /api/comments/:element
commentsApiRouter.get('/:element', function (req, res) {
    modelGetOne(commentModel, req, res);
});

// PUT /api/comments/:element
commentsApiRouter.put('/:element', function (req, res) {
    modelUpdate(commentModel, req, res);
});

// DELETE /api/comments/:element
commentsApiRouter.delete('/:element', function (req, res) {
    modelDelete(commentModel, req, res);
});
