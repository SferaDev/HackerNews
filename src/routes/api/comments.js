import express from "express";

import {modelCreate, modelDelete, modelGetAll, modelGetOne, modelUpdate} from "./base";
import {commentModel} from '../../models/comment';
import {messageCallback} from "../api";
import * as likeController from "../../controllers/likeController";

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

// POST /api/posts/:element/like
commentsApiRouter.post('/:element/like', function (req, res) {
    likeController.likeComment(req.user._id, req.params.element, function (err) {
        if (err) return messageCallback(res, 500, err);
        messageCallback(res, 200, 'Comment like added')
    });
});

// DELETE /api/posts/:element/like
commentsApiRouter.delete('/:element/like', function (req, res) {
    likeController.dislikeComment(req.user._id, req.params.element, function (err) {
        if (err) return messageCallback(res, 500, err);
        messageCallback(res, 200, 'Comment like removed')
    });
});
