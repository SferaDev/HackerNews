import {getAllPosts} from "../controllers/postController";

export const routes = [
    {
        route: '/',
        action: function (req, res, result) {
            res.redirect('/news');
            result();
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
            req.session.destroy(function (err) {
                if (err) console.error(err);
                res.redirect('/news');
                result();
            });
        }
    }
];