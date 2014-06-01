var mysql = require('mysql');
var pool  = mysql.createPool({
  debug: ['ComQueryPacket', 'RowDataPacket'],
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'api',
  password        : 'api',
  database: 'fleet_manager'
});


var express = require('express');
var bodyParser = require('body-parser');
var app = express();


// STATIC files.
app.use('/client', express.static(__dirname + '/../client'));
app.use('/bower_components', express.static(__dirname + '/../bower_components'));
app.use('/node_modules', express.static(__dirname + '/../node_modules'));

// parse json bodies
// has to be before other middlewares
app.use(bodyParser.json());


// API
var API_PREFIX = '/api/v1';
app.get(API_PREFIX + '/reservations', function(req, res) {
  pool.query('SELECT * FROM reservations WHERE start > NOW()', function(err, rows, fields) {
    if (err) throw err;

    res.send(rows);
  });
});

app.post(API_PREFIX + '/reservations', function(req, res) {
  pool.query('INSERT INTO reservations SET ?', req.body, function(err, rows, fields) {
    if (err) throw err;

    res.send(rows);
  });
});


app.get(API_PREFIX + '/cars', function(req, res) {
  pool.query('SELECT cars.*, car_models.name AS model_name FROM cars LEFT JOIN car_models ON cars.model_id = car_models.id', function(err, rows, fields) {
    if (err) throw err;

    res.send(rows);
  });
});


app.listen(3000);
