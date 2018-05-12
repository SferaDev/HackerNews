import express from "express";

import {modelCreate, modelDelete, modelGetAll, modelGetOne, modelUpdate} from "./base";
import {askModel, postModel, urlModel} from '../../models/post';
import {messageCallback} from "../api";
import * as likeController from "../../controllers/likeController";
import * as httpCodes from "../../utils/httpCodes";

export const postsApiRouter = express.Router();

// GET /api/posts
postsApiRouter.get('/', function (req, res) {
    modelGetAll(postModel, {}, req, res);
});

// GET /api/posts/newest
postsApiRouter.get('/newest', function (req, res) {
    let url = '/api/posts?sort=date&order=asc';
    for (let query in req.query) if (req.query.hasOwnProperty(query)) url += '&' + query + '=' + req.query[query];
    res.redirect(url);
});

// GET /api/posts/popular
postsApiRouter.get('/popular', function (req, res) {
    let url = '/api/posts?sort=totalLikes&order=desc';
    for (let query in req.query) if (req.query.hasOwnProperty(query)) url += '&' + query + '=' + req.query[query];
    res.redirect(url);
});

// GET /api/posts/url
postsApiRouter.get('/url', function (req, res) {
    modelGetAll(urlModel, {}, req, res);
});

// GET /api/posts/ask
postsApiRouter.get('/ask', function (req, res) {
    modelGetAll(askModel, {}, req, res);
});

// POST /api/posts
postsApiRouter.post('/', function (req, res) {
    if (req.body.type.toLowerCase() === 'url') modelCreate(urlModel, req, res);
    else if (req.body.type.toLowerCase() === 'ask') modelCreate(askModel, req, res);
    else messageCallback(res, httpCodes.STATUS_BAD_REQUEST, 'Please provide a post type (url or ask)')
});

// POST /api/posts/url
postsApiRouter.post('/url', function (req, res) {
    modelCreate(urlModel, req, res);
});

// POST /api/posts/ask
postsApiRouter.post('/ask', function (req, res) {
    modelCreate(askModel, req, res);
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
    postModel.findOne({_id: req.params.element}, function (err, element) {
        if (err)
            return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
        if (element === null)
            return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Post not found');
        likeController.likePost(req.user._id, req.params.element, function (err) {
            if (err === httpCodes.STATUS_BAD_REQUEST)
                return messageCallback(res, httpCodes.STATUS_BAD_REQUEST, 'Bad request');
            if (err === httpCodes.STATUS_CONFLICT)
                return messageCallback(res, httpCodes.STATUS_CONFLICT, 'You already like this post');
            if (err)
                return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
            messageCallback(res, 200, 'Post like added')
        });
    });
});

// DELETE /api/posts/:element/like
postsApiRouter.delete('/:element/like', function (req, res) {
    postModel.findOne({_id: req.params.element}, function (err, element) {
        if (err)
            return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
        if (element === null)
            return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Post not found');
        likeController.dislikePost(req.user._id, req.params.element, function (err) {
            if (err === httpCodes.STATUS_BAD_REQUEST)
                return messageCallback(res, httpCodes.STATUS_BAD_REQUEST, 'Bad request');
            if (err === httpCodes.STATUS_NOT_FOUND)
                return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'You do not like this post');
            if (err)
                return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
            messageCallback(res, 200, 'Post like removed')
        });
    });
});