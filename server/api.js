var scheduleGeneratingPdfForReservation = require('./pdf_forms').scheduleGeneratingPdfForReservation;

var DbQuery = require('./di-express').DbQuery;
var RequestBody = require('./di-express').RequestBody;
var PathParam = require('./di-express').PathParam;


function Error404(msg) {
  this.statusCode = 404;
  this.message = msg;
}

function takeOneRow(rows) {
  if (rows.length === 0) {
    throw new Error404('Record does not exist.');
  }

  return rows[0];
}

function formatDateToString(date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

function formatReservationDates(reservation) {
  reservation.start = formatDateToString(reservation.start);
  reservation.end = formatDateToString(reservation.end);

  return reservation;
}


exports.routes = {
  '/reservations': {

    'GET': {
      inject:          [DbQuery],
      handler: function(dbQuery) {
        return dbQuery('SELECT * FROM reservations WHERE start >= DATE(NOW())').then(function(reservations) {
          return reservations.map(formatReservationDates);
        });
      }
    },

    'POST': {
      inject:          [DbQuery, RequestBody],
      handler: function(dbQuery, reservation) {
        // TODO(vojta): read user_id from auth
        reservation.created_by = 1;

        function insertReservation(reservation) {
          return dbQuery('INSERT INTO reservations SET ?', reservation).then(function(result) {
            scheduleGeneratingPdfForReservation(dbQuery, result.insertId).done();

            return {
              id:result.insertId
            };
          });
        }

        if (reservation.customer) {
          var names = reservation.customer.split(' ', 2);

          return dbQuery('INSERT INTO customers SET ?', {first_name: names[0] || '', last_name: names[1] || ''}).then(function(result) {
            reservation.customer_id = result.insertId;
            delete reservation.customer;

            return insertReservation(reservation);
          });
        }

        return insertReservation(reservation);
      }
    }
  },


  '/reservations/:id': {

    'GET': {
      inject:          [DbQuery, PathParam('id')],
      handler: function(dbQuery, id) {
        console.log(id)
        return dbQuery('SELECT reservations.*, cars.name AS car_name FROM reservations LEFT JOIN cars ON reservations.car_id = cars.id WHERE reservations.id = ?', id)
          .then(takeOneRow).then(formatReservationDates);
      }
    }
  },


  '/cars': {

    'GET': {
      inject: [DbQuery],
      handler: function(dbQuery) {
        return dbQuery('SELECT cars.*, car_models.name AS model_name FROM cars LEFT JOIN car_models ON cars.model_id = car_models.id');
      }
    }
  }
};
