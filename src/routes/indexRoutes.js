import * as userController from "../controllers/userController";
import * as commentController from "../controllers/commentController";
import * as likeController from "../controllers/likeController";
import * as postController from "../controllers/postController";

export const routes = [
    {
        route: '/',
        getAction: function (req, res, result) {
            res.redirect('/news');
            result();
        }
    },
    {
        route: '/apigen',
        getAction: function (req, res, result) {
            userController.regenerateAPIKey(req.session.userId, function () {
                res.redirect(req.query.back !== undefined ? req.query.back : '/');
                result();
            })
        }
    },
    {
        route: '/ask',
        render: 'news',
        getAction: function (req, res, result) {
            postController.getAllPosts(function (posts) {
                result({
                    posts: posts.filter(post => post.__type === "Ask")
                });
            });
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
        route: '/delete',
        getAction: function (req, res, result) {
            let callback = function () {
                res.redirect(req.query.back !== undefined ? req.query.back : '/');
                result();
            };
            if (req.query.id !== undefined && req.query.id !== '') {
                if (req.query.type === 'comment') {
                    commentController.getCommentById(req.query.id, function (comment) {
                        if (comment.owner.username === req.session.username || req.session.isAdmin) {
                            commentController.deleteComment(req.query.id, callback);
                        } else callback();
                    });
                } else if (req.query.type === 'post') {
                    postController.getPostById(req.query.id, function (post) {
                        if (post.owner.username === req.session.username || req.session.isAdmin) {
                            postController.deletePost(req.query.id, callback);
                        } else callback();
                    });
                } else callback();
            } else callback();
        }
    },
    {
        route: '/edit',
        render: 'edit',
        title: 'Edit',
        getAction: function (req, res, result) {
            if (req.query.type === 'post') {
                postController.getPostById(req.query.id, function (post) {
                    result({
                        post: post,
                        comment: null,
                        backUrl: req.query.back
                    });
                });
            } else if (req.query.type === 'comment') {
                commentController.getCommentById(req.query.id, function (comment) {
                    postController.getPostById(comment.post, function (post) {
                        result({
                            post: post,
                            comment: comment,
                            backUrl: req.query.back
                        });
                    })
                })
            }
        },
        postAction: function (req, res) {
            let callback = function () {
                if (req.body.backUrl !== undefined) res.redirect(req.body.backUrl);
                else if (req.body.commentId === undefined) res.redirect('/item?id=' + req.body.id);
                else res.redirect('/item?id=' + req.body.id + '#' + req.body.commentId);
            };
            if (req.body.comment === undefined) {
                postController.getPostById(req.body.id, function (post) {
                    if (post.owner.username === req.session.username || req.session.isAdmin) {
                        postController.updatePost(req.body.id, req.body.title, req.body.text, callback);
                    } else callback();
                });
            } else {
                commentController.getCommentById(req.body.commentId, function (comment) {
                    if (comment.owner.username === req.session.username || req.session.isAdmin) {
                        commentController.updateComment(req.body.commentId, req.body.comment, callback)
                    } else callback();
                });
            }
        }
    },
    {
        route: '/from',
        render: 'news',
        getAction: function (req, res, result) {
            postController.getPostsByTld(req.query.site, function (posts) {
                result({
                    posts: posts
                });
            });
        }
    },
    {
        route: '/item',
        render: 'item',
        getAction: function (req, res, result) {
            postController.getPostById(req.query.id, function (post) {
                commentController.getCommentsByPost(req.query.id, function (comments) {
                    result({
                        post: post,
                        comments: comments
                    });
                })
            })
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
                    userController.loginUser(req.body.username, req.body.password, function (user) {
                        if (user === null) {
                            // TODO: User already exist
                        } else {
                            req.session.userId = user._id;
                            req.session.username = user.username;
                            req.session.isAdmin = user.isAdmin;
                        }
                        res.redirect('/');
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
                res.redirect(req.query.back !== undefined ? req.query.back : '/');
                result();
            });
        }
    },
    {
        route: '/newcomments',
        render: 'threads',
        getAction: function (req, res, result) {
            commentController.getAllComments(function (comments) {
                result({
                    comments: comments.sort(function compare(a, b) {
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
        route: '/newest',
        render: 'news',
        getAction: function (req, res, result) {
            postController.getAllPosts(function (posts) {
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
        route: '/news',
        render: 'news',
        getAction: function (req, res, result) {
            postController.getAllPosts(function (posts) {
                result({
                    posts: posts.filter(post => post.__type === "Url").sort(function compare(a, b) {
                        if (a.totalLikes < b.totalLikes)
                            return 1;
                        else if (a.totalLikes > b.totalLikes)
                            return -1;
                        return 0;
                    })
                });
            });
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
                        res.redirect('/');
                    });
                }
            }
        }
    },
    {
        route: '/reply',
        render: 'reply',
        title: 'Add Comment',
        getAction: function (req, res, result) {
            if (req.query.id !== undefined && req.query.goto !== undefined) {
                commentController.getCommentById(req.query.id, function (comment) {
                    postController.getPostById(req.query.goto, function (post) {
                        result({
                            comment: comment,
                            post: post
                        });
                    })
                })
            }
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
                postController.insertUrlPost(req.session.userId, req.body.title, req.body.url, function (post) {
                    if (post !== undefined) res.redirect('/item?id=' + post._id);
                    else res.redirect('/newest');
                });
            } else if (req.body.url === '') {
                postController.insertAskPost(req.session.userId, req.body.title, req.body.text, function () {
                    res.redirect('/newest');
                });
            } else {
                res.redirect('/submit?invalid=1');
            }
        }
    },
    {
        route: '/submitted',
        render: 'news',
        getAction: function (req, res, result) {
            postController.getPostsByOwner(req.query.id, function (posts) {
                result({
                    posts: posts
                });
            })
        }
    },
    {
        route: '/threads',
        render: 'threads',
        getAction: function (req, res, result) {
            commentController.getCommentsByOwner(req.query.id, function (comments) {
                result({
                    comments: comments.sort(function compare(a, b) {
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
                        if (user !== null) delete user.password;
                        vars.user = user;
                        result(vars);
                    });
                }
            })
        },
        postAction: function (req, res) {
            userController.updateUser(req.session.userId, req.body.about, function () {
                res.redirect("/user?id=" + req.session.username);
            });
        }
    },
    {
        route: '/vote',
        getAction: function (req, res, result) {
            let callback = function () {
                res.redirect(req.query.back !== undefined ? req.query.back : '/');
                result();
            };
            if (req.query.id !== undefined && req.query.id !== '') {
                if (req.query.how === 'up') {
                    if (req.query.type === 'post')
                        likeController.likePost(req.session.userId, req.query.id, callback);
                    else if (req.query.type === 'comment')
                        likeController.likeComment(req.session.userId, req.query.id, callback);
                } else if (req.query.how === 'down') {
                    if (req.query.type === 'post')
                        likeController.dislikePost(req.session.userId, req.query.id, callback);
                    else if (req.query.type === 'comment')
                        likeController.dislikeComment(req.session.userId, req.query.id, callback);
                } else callback();
            } else callback();
        }
    },
    {
        route: '/welcome',
        render: 'welcome',
        title: 'Welcome'
    }
];
