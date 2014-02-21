var page = {};
var blog = require('../../../modules/blog');

page.post = function (req, res) {
    blog
        .post({
            title: req.body.title,
            author: req.body.author,
            message: req.body.message
        })
        .then(function () {
            res.send({'status': 'SUCCESS'});
        }, function (err) {
            res.send(500, {'status': 'FAILED', 'message': err});
            console.error('Post not added: ', err);
        });
};

page.list = function (req, res) {
    blog
        .list()
        .then(function (threads) {
            res.send({'status': 'SUCCESS', 'data': threads});
        }, function (err) {
            res.send(500, {'status': 'FAILED', 'message': err});
            console.error('List with posts not showed: ', err);
        });
};

page.show = function (req, res) {
    blog
        .show(req.params.title)
        .then(function (threads) {
            res.send({'status': 'SUCCESS', 'data': threads});
        }, function (err) {
            res.send(500, {'status': 'FAILED', 'message': err});
            console.error('Cant show post: ', err);
        });
};

module.exports = page;