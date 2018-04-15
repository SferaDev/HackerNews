import {getAllPosts} from "../controllers/postController";

export const routes = [
    {
        route: '/',
        render: 'news',
        action: function (req, res, result) {
            getAllPosts(function (posts) {
                result({posts: posts.filter(post => post.__type === "Url")});
            });
        }
    },
    {
        route: '/news/',
        render: 'news',
        action: function (req, res, result) {
            getAllPosts(function (posts) {
                result({posts: posts.filter(post => post.__type === "Url")});
            });
        }
    },
    {
        route: '/newest/',
        render: 'news',
        action: function (req, res, result) {
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
        route: '/submit/',
        render: 'submit',
        title: 'Submit'
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
        route: '/login/',
        render: 'login',
        title: 'Login'
    },
    {
        route: '/register/',
        render: 'login',
        title: 'Login'
    },
    {
        route: '/logout/',
        action: function (req, res, result) {
            res.clearCookie('userToken');
            res.redirect('/news/');
            result();
        }
    }
];