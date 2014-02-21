var http = require('http');
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var blog = require('./bundles/api/blog');
var app = express();

mongoose.connect('mongodb://localhost/andychups');
mongoose.connection.on('error', function (err) {
    console.error(err);
});


app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'bundles'));
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(function (err, req, res, next) {
    res.status(500);
    res.render('error/error', { error: err });
});

app.post('/api/blog/thread', blog.post);
app.get('/api/blog/thread/:title.:format?', blog.show);
app.get('/api/blog/thread', blog.list);
app.get('/api/blog/show', blog.show);

app.get('/post', require('./bundles/post').result);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
