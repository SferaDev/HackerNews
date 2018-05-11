import * as httpCodes from "../../utils/httpCodes";
import {messageCallback} from "../api";
import {propertyFinder} from "../../utils/magicUtils";

export const modelGetAll = function (model, req, res) {
    model.find({}, propertyFinder(model, 'public'), function (err, elements) {
        if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
        res.status(httpCodes.STATUS_OK).send(elements);
    });
};

export const modelCreate = function (model, req, res) {
    let attributes = {};
    let findParameters = {};
    findParameters[model.identifier()] = req.body[model.identifier().replace('_', '')];

    let requiredProperties = propertyFinder(model, 'required');
    for (let i = 0; i < requiredProperties.length; ++i) {
        if (req.body[requiredProperties[i]]) attributes[requiredProperties[i]] = req.body[requiredProperties[i]];
        else return messageCallback(res, httpCodes.STATUS_BAD_REQUEST, 'Missing parameter ' + requiredProperties[i]);
    }

    let editableProperties = propertyFinder(model, 'editable');
    for (let i = 0; i < editableProperties.length; ++i) {
        if (req.body[editableProperties[i]]) attributes[editableProperties[i]] = req.body[editableProperties[i]];
    }

    model.count(findParameters, function (err, count) {
        if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, err);
        if (count > 0) return messageCallback(res, httpCodes.STATUS_CONFLICT, 'Element already exists');
        model.create(attributes, function (err2, element) {
            if (err2) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, err2);
            return messageCallback(res, httpCodes.STATUS_CREATED, 'Element created');
        })
    });
};

export const modelGetOne = function (model, req, res) {
    let findParameters = {};
    findParameters[model.identifier()] = req.params.element;

    model.findOne(findParameters, propertyFinder(model, 'public'), function (err, element) {
        if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
        if (element === null) return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Element not found');
        res.status(httpCodes.STATUS_OK).send(element);
    });
};

export const modelUpdate = function (model, req, res) {
    let findParameters = {};
    findParameters[model.identifier()] = req.params.element;

    model.findOne(findParameters, function (err, element) {
        if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
        if (element === null) return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Element not found');
        if (req.user.isAdmin || element.canEdit(req.user._id)) {
            let editableProperties = propertyFinder(model, 'editable');
            for (let i = 0; i < editableProperties.length; ++i) {
                if (req.body[editableProperties[i]]) element[editableProperties[i]] = req.body[editableProperties[i]];
            }
            element.save();
            return messageCallback(res, httpCodes.STATUS_OK, 'Element updated');
        } else return messageCallback(res, httpCodes.STATUS_FORBIDDEN, 'You are not allowed to update element');
    });
};

export const modelDelete = function (model, req, res) {
    let findParameters = {};
    findParameters[model.identifier()] = req.params.element;

    model.findOne(findParameters, function (err, element) {
        if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
        if (element === null) return messageCallback(res, httpCodes.STATUS_NOT_FOUND, 'Element not found');
        if (req.user.isAdmin || element.canEdit(req.user._id)) {
            element.executeDelete();
            return messageCallback(res, httpCodes.STATUS_OK, 'Element deleted');
        } else return messageCallback(res, httpCodes.STATUS_FORBIDDEN, 'You are not allowed to update element');
    });
};
