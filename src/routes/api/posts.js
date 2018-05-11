import express from "express";

import {modelCreate, modelDelete, modelGetAll, modelGetOne, modelUpdate} from "./base";
import {askModel, postModel, urlModel} from '../../models/post';
import {messageCallback} from "../api";
import * as likeController from "../../controllers/likeController";

export const postsApiRouter = express.Router();

// GET /api/posts
postsApiRouter.get('/', function (req, res) {
    modelGetAll(postModel, req, res);
});

// POST /api/posts
postsApiRouter.post('/', function (req, res) {
    if (req.body.type === 'url') modelCreate(urlModel, req, res);
    else if (req.body.type === 'ask') modelCreate(askModel, req, res);
    else messageCallback(res, 400, 'Please provide a post type')
});

// GET /api/posts/:element
postsApiRouter.get('/:element', function (req, res) {
    modelGetOne(postModel, req, res);
});

// PUT /api/posts/:element
postsApiRouter.put('/:element', function (req, res) {
    modelUpdate(postModel, req, res);
});

// DELETE /api/posts/:element
postsApiRouter.delete('/:element', function (req, res) {
    modelDelete(postModel, req, res);
});

// POST /api/posts/:element/like
postsApiRouter.post('/:element/like', function (req, res) {
    likeController.likePost(req.user._id, req.params.element, function (err) {
        if (err) return messageCallback(res, 400, err);
        messageCallback(res, 200, 'Post like added')
    });
});

// DELETE /api/posts/:element/like
postsApiRouter.delete('/:element/like', function (req, res) {
    likeController.dislikePost(req.user._id, req.params.element, function (err) {
        if (err) return messageCallback(res, 400, err);
        messageCallback(res, 200, 'Post like removed')
    });
});