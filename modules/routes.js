/**
 * @file Routing
 * @date 16.08.14
 * @author andychups <andychups@yandex-team.ru>
 */

const PROJECT_PATH = process.env.PROJECT_PATH;

var path = require('path');
var express = require('express');
var app = module.exports = express();


// Custom template engine
app.set('views', path.join(PROJECT_PATH, 'desktop.bundles'));
app.set('view engine', 'yate');
app.engine('yate', require('yate-express').__express);


// Routes
app.get('/', function (req, res) {
    res.render('index/index-view.yate');
});

app.get('/resume', function (req, res) {
    res.render('resume/resume-view.yate');
});

app.get('/works', function (req, res) {
    res.render('works/works-view.yate');
});

app.get('/blog', function (req, res) {
    res.render('blog/blog-view.yate');
});


// Static (TODO: delegate to nginx)
app.use('/desktop.bundles', express.static(PROJECT_PATH + '/desktop.bundles'));


// Errors handling
app.get('*', function (req, res) {
    res.status(404);
    res.render('error/error.yate', { error: {'code': 404, 'message': 'Page not found'} });
});

app.use(function (err, req, res, next) {
    res.status(500);
    console.log(err);
    res.render('error/error.yate', { error: {'code': 500, 'message': JSON.stringify(err)} });
});