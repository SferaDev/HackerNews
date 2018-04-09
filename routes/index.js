var express = require('express');
var router = express.Router();

/* GET root page. */
router.get('/', function (req, res, next) {
    res.render('news', {
        title: 'News4Hackers',
        username: 'Swaggaaa', // TODO: Hard-coded beef
        userScore: 1337
    });
});

module.exports = router;
