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


app.use('/client', express.static(__dirname + '/../client'));
app.use('/bower_components', express.static(__dirname + '/../bower_components'));
app.use('/node_modules', express.static(__dirname + '/../node_modules'));

// parse json bodies
// has to be before other middlewares
app.use(bodyParser.json());

app.get('/api/v1/reservations', function(req, res) {
  pool.query('SELECT * FROM users', function(err, rows, fields) {
    if (err) throw err;

    res.send(rows);
  });
});

app.post('/api/v1/reservations', function(req, res) {
  pool.query('INSERT INTO reservations SET ?', req.body, function(err, rows, fields) {
    if (err) throw err;

    res.send(rows);
  });
});


app.listen(3000);
