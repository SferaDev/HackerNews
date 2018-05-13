import mongoose from "mongoose";

import * as httpCodes from "../../utils/httpCodes";
import {messageCallback} from "../api";
import {propertyFinder} from "../../utils/magicUtils";

export const modelGetAll = function (model, query, req, res) {
    model.find(query, propertyFinder(model, 'public'), function (err, elements) {
        if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, err);
        res.status(httpCodes.STATUS_OK).send(elements);
    });
};

export const modelCreate = function (model, req, res) {
    let findParameters = [{[model.identifier()]: req.body[model.identifier()]}];
    let uniqueProperties = propertyFinder(model, 'unique');
    for (let i = 0; i < uniqueProperties.length; ++i) {
        if (req.body[uniqueProperties[i]]) {
            findParameters.push({[uniqueProperties[i]]: req.body[uniqueProperties[i]]});
        }
    }

    model.count({$or: findParameters}, function (err, count) {
        if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, err);
        if (count > 0) return messageCallback(res, httpCodes.STATUS_CONFLICT, 'Element already exists');

        let attributes = {};

        let requiredProperties = propertyFinder(model, 'required');
        for (let i = 0; i < requiredProperties.length; ++i) {
            if (req.body[requiredProperties[i]]) attributes[requiredProperties[i]] = req.body[requiredProperties[i]];
            else return messageCallback(res, httpCodes.STATUS_BAD_REQUEST, 'Missing parameter ' + requiredProperties[i]);
        }

        let editableProperties = [...new Set([...propertyFinder(model, 'editable'), ...propertyFinder(model, 'final')])];
        for (let i = 0; i < editableProperties.length; ++i) {
            if (req.body[editableProperties[i]]) attributes[editableProperties[i]] = req.body[editableProperties[i]];
        }

        model.create(attributes, function (err2, element) {
            if (err2) return messageCallback(res, httpCodes.STATUS_BAD_REQUEST, err2);
            return messageCallback(res, httpCodes.STATUS_CREATED, 'Element created (invalid attributes discarded)');
        });
    });
};

export const modelGetOne = function (model, req, res) {
    let findParameters = {};
    findParameters[model.identifier()] = req.params.element;

    model.findOne(findParameters, propertyFinder(model, 'public'), function (err, element) {
        if (err) {
            if (err.name === 'CastError') return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Element not found');
            else return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, err);
        }
        if (element === null) return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Element not found');
        res.status(httpCodes.STATUS_OK).send(element);
    });
};

export const modelUpdate = function (model, req, res) {
    let findParameters = {};
    findParameters[model.identifier()] = req.params.element;

    model.findOne(findParameters, function (err, element) {
        if (err) {
            if (err.name === 'CastError') return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Element not found');
            else return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, err);
        }
        if (element === null) return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Element not found');
        if (req.user.isAdmin || element.canEdit(req.user._id)) {
            if (element.__type !== undefined) model = mongoose.model(element.__type);
            let editableProperties = propertyFinder(model, 'editable');
            for (let i = 0; i < editableProperties.length; ++i) {
                if (req.body[editableProperties[i]]) element[editableProperties[i]] = req.body[editableProperties[i]];
            }
            element.save();
            return messageCallback(res, httpCodes.STATUS_OK, 'Element updated (invalid attributes discarded)');
        } else return messageCallback(res, httpCodes.STATUS_FORBIDDEN, 'You are not allowed to update element');
    });
};

export const modelDelete = function (model, req, res) {
    let findParameters = {};
    findParameters[model.identifier()] = req.params.element;

    model.findOne(findParameters, function (err, element) {
        if (err) {
            if (err.name === 'CastError') return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Element not found');
            else return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, err);
        }
        if (element === null) return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Element not found');
        if (req.user.isAdmin || element.canEdit(req.user._id)) {
            element.executeDelete(function (success) {
                if (!success) return messageCallback(res, httpCodes.STATUS_CONFLICT, 'Element is already deleted');
                return messageCallback(res, httpCodes.STATUS_OK, 'Element deleted');
            });
        } else return messageCallback(res, httpCodes.STATUS_FORBIDDEN, 'You are not allowed to update element');
    });
};
