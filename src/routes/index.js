import {getUser} from "../controllers/userController";
import {routes} from "./indexRoutes";

const express = require('express');
export const indexRouter = express.Router();

routes.forEach(function (doc) {
    // Create GET endpoint placeholders
    if (doc.render !== undefined || doc.getAction !== undefined) {
        indexRouter.get(doc.route, function (req, res) {
            req.session.returnTo = req.originalUrl;
            getUser(req.session.userId, function (user) {
                let mainAttributes = {
                    subtitle: doc.title === "Profile: " ? doc.title + req.query.id : doc.title,
                    username: user === null ? undefined : user.username,
                    isAdmin: user === null ? false : user.isAdmin,
                    karma: user === null ? undefined : user.karma,
                    url: req.originalUrl
                };
                if (doc.getAction !== undefined) {
                    doc.getAction(req, res, function (attributes) {
                        if (attributes !== undefined)
                            Object.assign(mainAttributes, attributes);
                        if (doc.render !== undefined)
                            res.render(doc.render, mainAttributes);
                    });
                } else if (doc.render !== undefined) res.render(doc.render, mainAttributes);
            });
        });
    }

    // Create POST endpoint placeholders
    if (doc.postAction !== undefined) {
        indexRouter.post(doc.route, function (req, res) {
            doc.postAction(req, res);
        });
    }
});

// Detect errors and forward to 404
indexRouter.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
indexRouter.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
