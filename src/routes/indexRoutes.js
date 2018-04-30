import {
    getAllPosts,
    getPostById,
    getPostsByOwner,
    getPostsByTld,
    insertAskPost,
    insertUrlPost
} from "../controllers/postController";
import * as userController from "../controllers/userController";
import * as commentController from "../controllers/commentController";
import * as likeController from "../controllers/likeController";

export const routes = [
    {
        route: '/',
        getAction: function (req, res, result) {
            res.redirect('/news');
            result();
        }
    },
    {
        route: '/news',
        render: 'news',
        getAction: function (req, res, result) {
            getAllPosts(function (posts) {
                result({
                    posts: posts.filter(post => post.__type === "Url")
                });
            });
        }
    },
    {
        route: '/threads',
        render: 'news',
        getAction: function (req, res, result) {
            getPostsByOwner(req.query.id, function (posts) {
                result({
                    posts: posts
                });
            });
        }
    },
    {
        route: '/ask',
        render: 'news',
        getAction: function (req, res, result) {
            getAllPosts(function (posts) {
                result({
                    posts: posts.filter(post => post.__type === "Ask")
                });
            });
        }
    },
    {
        route: '/newest',
        render: 'news',
        getAction: function (req, res, result) {
            getAllPosts(function (posts) {
                result({
                    posts: posts.sort(function compare(a, b) {
                        if (a.createdAt < b.createdAt)
                            return 1;
                        else if (a.createdAt > b.createdAt)
                            return -1;
                        return 0;
                    })
                });
            });
        }
    },
    {
        route: '/from',
        render: 'news',
        getAction: function (req, res, result) {
            getPostsByTld(req.query.site, function (posts) {
                result({
                    posts: posts
                });
            });
        }
    },
    {
        route: '/submit',
        render: 'submit',
        title: 'Submit',
        getAction: function (req, res, result) {
            result({
                invalid: req.query.invalid
            });
        },

        postAction: function (req, res) {
            if (req.body.title === '')
                res.redirect('/submit?invalid=2');
            else if (req.body.url !== '' && req.body.text === '') {
                insertUrlPost(req.session.userId, req.body.title, req.body.url, function () {
                    res.redirect('/newest');
                });
            } else if (req.body.url === '') {
                insertAskPost(req.session.userId, req.body.title, req.body.text, function () {
                    res.redirect('/newest');
                });
            } else {
                res.redirect('/submit?invalid=1');
            }
        }
    },
    {
        route: '/comment',
        postAction: function (req, res) {
            if (req.body.postId !== '' && req.body.text !== '') {
                commentController.insertComment(req.session.userId, req.body.postId, req.body.text, req.body.parentComment, function () {
                    res.redirect('/item?id=' + req.body.postId); // TODO: Anchor new comment
                });
            } else res.redirect('/newest');
        }
    },
    {
        route: '/guidelines',
        render: 'guidelines',
        title: 'Guidelines'
    },
    {
        route: '/faq',
        render: 'faq',
        title: 'FAQ'
    },
    {
        route: '/lists',
        render: 'lists',
        title: 'Lists'
    },
    {
        route: '/welcome',
        render: 'welcome',
        title: 'Welcome'
    },
    {
        route: '/user',
        render: 'user',
        title: 'Profile: ',
        getAction: function (req, res, result) {
            userController.getUser(req.session.userId, function (user) {
                let isOwnProfile = user !== null && user.username === req.query.id;
                let vars = {isOwnProfile: isOwnProfile};
                if (isOwnProfile) {
                    delete user.password;
                    vars.user = user;
                    result(vars);
                } else {
                    userController.getUserByUsername(req.query.id, function (user) {
                        delete user.password;
                        vars.user = user;
                        result(vars);
                    });
                }
            })
        },
        postAction: function (req, res) {
            userController.updateUser(req.session.userId, req.body.about, req.body.showd, req.body.nopro,
                req.body.maxv, req.body.mina, req.body.delay, function () {
                    res.redirect("/user?id=" + req.session.username);
                });
        }
    },
    {
        route: '/login',
        render: 'login',
        title: 'Login',
        getAction: function (req, res, result) {
            if (process.env.GITHUB_CLIENT_ID) res.redirect('/');
            result();
        },
        postAction: function (req, res) {
            if (!process.env.GITHUB_CLIENT_ID) {
                if (req.body.username !== '' && req.body.password !== '') {
                    userController.loginUser(req.body.username, req.body.password, function (userId) {
                        if (userId === null) {
                            // TODO: User already exist
                        } else {
                            req.session.userId = userId;
                            req.session.username = req.body.username;
                        }
                        res.redirect('/news');
                    });
                }
            }
        }
    },
    {
        route: '/register',
        render: 'login',
        title: 'Login',
        getAction: function (req, res, result) {
            if (process.env.GITHUB_CLIENT_ID) res.redirect('/');
            result();
        },
        postAction: function (req, res) {
            if (!process.env.GITHUB_CLIENT_ID) {
                if (req.body.username !== '' && req.body.password !== '') {
                    userController.registerUser(req.body.username, req.body.password, function (userId) {
                        if (userId === null) {
                            // TODO: User already exist
                        } else {
                            req.session.userId = userId;
                            req.session.username = req.body.username;
                        }
                        res.redirect('/news');
                    });
                }
            }
        }
    },
    {
        route: '/logout',
        getAction: function (req, res, result) {
            req.session.destroy(function (err) {
                if (err) console.error(err);
                res.redirect('/news');
                result();
            });
        }
    },
    {
        route: '/item',
        render: 'item',
        getAction: function (req, res, result) {
            getPostById(req.query.id, function (post) {
                commentController.getCommentsByPostId(req.query.id, function (comments) {
                    result({
                        post: post,
                        comments: comments
                    });
                })
            })
        }
    },
    {
        route: '/vote',
        getAction: function (req, res, result) {
            let callback = function () {
                if (req.query.back === undefined) res.redirect('/news');
                else res.redirect(req.query.back);
                result();
            };
            if (req.query.id !== undefined && req.query.id !== '') {
                if (req.query.how === 'up')
                    likeController.likePost(req.session.userId, req.query.id, callback);
                else if (req.query.how === 'down')
                    likeController.dislikePost(req.session.userId, req.query.id, callback);
                else callback();
            } else callback();
        }
    }
];