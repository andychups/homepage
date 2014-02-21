var page = {};
var blog = require('../../../modules/blog');

page.post = function (req, res) {
    blog.list({
        data: {
            title: req.body.title,
            author: req.body.author,
            message: req.body.message
        },

        success: function () {
            res.send({'status': 'SUCCESS'});
        },

        fail: function (err) {
            res.send(500, {'status': 'FAILED', 'message': err});
            console.error('Post not added: ', err);
        }
    });
};

page.list = function (req, res) {
    blog.list({
        success: function (threads) {
            res.send({'status': 'SUCCESS', 'data': threads});
        },

        fail: function (err) {
            res.send(500, {'status': 'FAILED', 'message': err});
            console.error('List with posts not showed: ', err);
        }
    });
};

page.show = function (req, res) {
    blog.show({
        data: {
            title: req.params.title
        },

        success: function (threads) {
            res.send({'status': 'SUCCESS', 'data': threads});
        },

        fail: function (err) {
            res.send(500, {'status': 'FAILED', 'message': err});
            console.error('Cant show post: ', err);
        }
    });
};

module.exports = page;