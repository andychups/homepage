var blog = {};
var Thread = require('../models/thread.js');
var Post = require('../models/post.js');

/**
 * Добавления поста
 * @param {Object} params
 * @param {Object} params.data
 * @param {String} params.data.title Заголовок
 * @param {String} params.data.author Имя автора
 * @param {Function} params.success Позитивный коллбек
 * @param {Function} params.fail Негативный коллбек
 */
blog.post = function (params) {
    new Thread({title: params.data.title, author: params.data.author}).save(function (err) {
        if (err) {
            params.fail(err);
            return;
        }

        params.success();
    });
};

/**
 * Возвращает список с постами
 * @param {Object} params
 * @param {Function} params.success Позитивный коллбек
 * @param {Function} params.fail Негативный коллбек
 */
blog.list = function (params) {
    Thread.find(function (err, threads) {
        if (err) {
            params.fail(err);
            return;
        }

        params.success(threads);
    });
};


/**
 * Ищет пост по заголовку
 * @param {Object} params
 * @param {Object} params.data
 * @param {String} params.data.title Заголовок
 * @param {Function} params.success Позитивный коллбек
 * @param {Function} params.fail Негативный коллбек
 */
blog.show = function (params) {
    Thread.findOne({title: title}, function (err, thread) {
        if (err) {
            params.fail(err);
            return;
        }

        Post.find({thread: thread._id}, function (err, posts) {
            if (err) {
                params.fail(err);
                return;
            }

            params.success({thread: thread, posts: posts});
        });
    });
};

module.exports = blog;