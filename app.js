var http = require('http');
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 8000);
app.use(require('routes'));

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
