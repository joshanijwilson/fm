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


// STORAGE - uploads.
var fs = require('fs');
var path = require('path');
var busboy = require('connect-busboy');

// Pseudo-random 16chars hex string.
function randomHex() {
  return Math.random().toString(16).slice(2, 8) + Math.random().toString(16).slice(2, 8) + Math.random().toString(16).slice(2, 6);
}

app.use(busboy());

app.post('/storage/upload', function(req, res, next) {

  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {

    var storageId = randomHex() + path.extname(filename).toLowerCase();
    var fstream = fs.createWriteStream(__dirname + '/../storage/uploads/' + storageId);

    file.pipe(fstream);
    fstream.on('close', function () {
      res.setHeader('Location', '/storage/uploads/' + storageId);
      res.end();
    });
  });
});

// TODO(vojta): Do heavy caching.
app.get('/storage/uploads/:file', function(req, res, next) {
  send(req, req.params.file, {root: __dirname + '/../storage/uploads'}).pipe(res);
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
console.log('port', config.port)
function closeMySqlConnectionPool() {
  pool.end();
  process.exit(0);
}

process.on('SIGINT', closeMySqlConnectionPool);
process.on('SIGTERM', closeMySqlConnectionPool);
