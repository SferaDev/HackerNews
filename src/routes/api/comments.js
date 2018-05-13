import express from "express";

import {modelCreate, modelDelete, modelGetAll, modelGetOne, modelUpdate} from "./base";
import {commentModel} from '../../models/comment';
import {messageCallback} from "../api";
import * as likeController from "../../controllers/likeController";
import * as httpCodes from "../../utils/httpCodes";

export const commentsApiRouter = express.Router();

// GET /api/comments
commentsApiRouter.get('/', function (req, res) {
    modelGetAll(commentModel, {}, req, res);
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
    commentModel.findOne({_id: req.params.element}, function (err, element) {
        if (err) {
            if (err.name === 'CastError') return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Comment not found');
            else return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, err);
        }
        if (element === null)
            return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Comment not found');
        likeController.likeComment(req.user._id, req.params.element, function (err) {
            if (err === httpCodes.STATUS_BAD_REQUEST)
                return messageCallback(res, httpCodes.STATUS_BAD_REQUEST, 'Bad request');
            if (err === httpCodes.STATUS_CONFLICT)
                return messageCallback(res, httpCodes.STATUS_CONFLICT, 'You already like this comment');
            if (err)
                return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
            messageCallback(res, 200, 'Comment like added')
        });
    });
});

// DELETE /api/posts/:element/like
commentsApiRouter.delete('/:element/like', function (req, res) {
    commentModel.findOne({_id: req.params.element}, function (err, element) {
        if (err) {
            if (err.name === 'CastError') return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Comment not found');
            else return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, err);
        }
        if (element === null)
            return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Comment not found');
        likeController.dislikeComment(req.user._id, req.params.element, function (err) {
            if (err === httpCodes.STATUS_BAD_REQUEST)
                return messageCallback(res, httpCodes.STATUS_BAD_REQUEST, 'Bad request');
            if (err === httpCodes.STATUS_NOT_FOUND)
                return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'You do not like this comment');
            if (err)
                return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
            messageCallback(res, 200, 'Comment like removed')
        });
    });
});