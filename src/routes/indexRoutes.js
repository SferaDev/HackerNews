import {
    getAllPosts,
    getPostById,
    getPostsByOwner,
    getPostsByTld,
    insertAskPost,
    insertUrlPost
} from "../controllers/postController";
import {loginUser, registerUser} from "../controllers/userController";
import {insertComment} from "../controllers/commentController";

export const routes = [
    {
        route: '/',
        getAction: function (req, res, result) {
            res.redirect('/news');
            result();
        }
    },
    {
        route: '/news/',
        render: 'news',
        getAction: function (req, res, result) {
            getAllPosts(function (posts) {
                result({posts: posts.filter(post => post.__type === "Url")});
            });
        }
    },
    {
        route: '/threads/',
        render: 'news',
        getAction: function (req, res, result) {
            getPostsByOwner(req.query.id, function (posts) {
                result({posts: posts});
            });
        }
    },
    {
        route: '/ask/',
        render: 'news',
        getAction: function (req, res, result) {
            getAllPosts(function (posts) {
                result({posts: posts.filter(post => post.__type === "Ask")});
            });
        }
    },
    {
        route: '/newest/',
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
        route: '/from/',
        render: 'news',
        getAction: function (req, res, result) {
            getPostsByTld(req.query.site, function (posts) {
                result({posts: posts});
            });
        }
    },
    {
        route: '/submit/',
        render: 'submit',
        title: 'Submit',
        postAction: function (req, res) {
            console.log(req.body);
            if (req.body.url !== '' && req.body.text === '') {
                insertUrlPost(req.session.userId, req.body.title, req.body.url, function () {
                    res.redirect('/newest');
                });
            } else if (req.body.url === '' && req.body.text !== '') {
                insertAskPost(req.session.userId, req.body.title, req.body.text, function () {
                    res.redirect('/newest');
                });
            } else res.redirect('/submit');
        }
    },
    {
        route: '/comment/',
        postAction: function (req, res) {
            if (req.body.postId !== '' && req.body.text === '') {
                insertComment(req.session.userId, req.body.postId, req.body.text, req.body.parentComment, function () {
                    res.redirect('/item?id=' + req.body.postId); // TODO: Anchor new comment
                });
            } else res.redirect('/newest');
        }
    },
    {
        route: '/guidelines/',
        render: 'guidelines',
        title: 'Guidelines'
    },
    {
        route: '/faq/',
        render: 'faq',
        title: 'FAQ'
    },
    {
        route: '/lists/',
        render: 'lists',
        title: 'Lists'
    },
    {
        route: '/welcome/',
        render: 'welcome',
        title: 'Welcome'
    },
    {
        route: '/user/',
        render: 'user',
        title: 'Profile: '
    },
    {
        route: '/login/',
        render: 'login',
        title: 'Login',
        postAction: function (req, res) {
            if (req.body.username !== '' && req.body.password !== '') {
                loginUser(req.body.username, req.body.password, function (userId) {
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
    },
    {
        route: '/register/',
        render: 'login',
        title: 'Login',
        postAction: function (req, res) {
            if (req.body.username !== '' && req.body.password !== '') {
                registerUser(req.body.username, req.body.password, function (userId) {
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
    },
    {
        route: '/logout/',
        getAction: function (req, res, result) {
            req.session.destroy(function (err) {
                if (err) console.error(err);
                res.redirect('/news');
                result();
            });
        }
    },
    {
        route: '/item/',
        render: 'item',
        getAction: function (req, res, result) {
            getPostById(req.query.id, function (post) {
                result({post: post})
            })
        }
    }
];