var mysql = require('mysql');
var config = require('../config').forCurrentEnvironment();
var pool  = mysql.createPool(config.mysql);


var express = require('express');
var send = require('send');
var app = express();


// WEB CLIENT - static files.
app.use('/', express.static(config.clientWebRoot, {
  index: config.clientIndex
}));

// STORAGE - static files.
app.get('/storage/reservations/:id-:document.pdf', function(req, res, next) {
  send(req, '/' + req.params.id + '-' + req.params.document + '.pdf', {root: __dirname + '/../storage/reservations'}).pipe(res);
});


// API routes, using DI.
var api = require('./api');
var diExpress = require('./di-express');
var di = require('di');

var injector = new di.Injector([
  diExpress.bind(diExpress.DbPool).toValue(pool)
]);

var router = new express.Router();
diExpress.registerRoutes(injector, router, api.routes);

app.use('/api/v1', router);

app.listen(config.port);

function closeMySqlConnectionPool() {
  pool.end();
  process.exit(0);
}

process.on('SIGINT', closeMySqlConnectionPool);
process.on('SIGTERM', closeMySqlConnectionPool);
