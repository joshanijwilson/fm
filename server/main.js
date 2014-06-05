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

var send = require('send');

// STATIC files.
app.use('/client', express.static(__dirname + '/../client'));
app.use('/bower_components', express.static(__dirname + '/../bower_components'));
app.use('/node_modules', express.static(__dirname + '/../node_modules'));

// parse json bodies
// has to be before other middlewares
app.use(bodyParser.json());


function formatDateToString(date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}


app.get('/storage/reservations/:id/protocol.pdf', function(req, res, next) {
  send(req, '/' + req.params.id + '/protocol.pdf', {root: __dirname + '/../storage/reservations'}).pipe(res);
});


// API
var API_PREFIX = '/api/v1';
app.get(API_PREFIX + '/reservations', function(req, res) {
  pool.query('SELECT * FROM reservations WHERE start >= DATE(NOW())', function(err, rows, fields) {
    if (err) throw err;

    // Normalize dates.
    rows.forEach(function(row) {
      row.start = formatDateToString(row.start);
      row.end = formatDateToString(row.end);
    });

    res.send(rows);
  });
});

app.get(API_PREFIX + '/reservations/:id', function(req, res) {
  pool.query('SELECT reservations.*, cars.name AS car_name FROM reservations LEFT JOIN cars ON reservations.car_id = cars.id WHERE reservations.id = ?', req.params.id, function(err, rows, fields) {
    if (err) throw err;

    // Normalize dates.
    rows.forEach(function(row) {
      row.start = formatDateToString(row.start);
      row.end = formatDateToString(row.end);
    });

    res.send(rows[0]);
  });
});

function insertReservation(res, reservation) {
  pool.query('INSERT INTO reservations SET ?', reservation, function(err, result) {
    if (err) throw err;
    res.send({id: result.insertId});
  });
}

app.post(API_PREFIX + '/reservations', function(req, res) {
  var reservation = req.body;

  // TODO(vojta): read user_id from auth
  reservation.created_by = 1;

  if (reservation.customer) {
    var names = reservation.customer.split(' ', 2);
    pool.query('INSERT INTO customers SET ?', {first_name: names[0] || '', last_name: names[1] || ''}, function(err, result) {
      if (err) throw err;
      delete reservation.customer;
      reservation.customer_id = result.insertId;
      insertReservation(res, reservation);
    });
  } else {
    insertReservation(res, reservation);
  }
});


app.get(API_PREFIX + '/cars', function(req, res) {
  pool.query('SELECT cars.*, car_models.name AS model_name FROM cars LEFT JOIN car_models ON cars.model_id = car_models.id', function(err, rows, fields) {
    if (err) throw err;

    res.send(rows);
  });
});


app.listen(3000);
