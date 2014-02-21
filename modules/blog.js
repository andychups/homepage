var blog = {};
var Vow = require('vow');
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
    var promise = Vow.promise();

    new Thread({title: params.title, author: params.author}).save(function (err) {
        if (err) {
            promise.reject(err);
            return;
        }

        promise.fulfill();
    });

    return promise;
};

/**
 * Возвращает список с постами
 * @param {Object} params
 * @param {Function} params.success Позитивный коллбек
 * @param {Function} params.fail Негативный коллбек
 */
blog.list = function (params) {
    var promise = Vow.promise();

    Thread.find(function (err, threads) {
        if (err) {
            promise.reject(err);
            return;
        }

        promise.fulfill(threads);
    });

    return promise;
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
    var promise = Vow.promise();

    Thread.findOne({title: title}, function (err, thread) {
        if (err) {
            promise.reject(err);
            return;
        }

        Post.find({thread: thread._id}, function (err, posts) {
            if (err) {
                promise.reject(err);
                return;
            }

            promise.fulfill({thread: thread, posts: posts});
        });
    });

    return promise;
};

module.exports = blog;