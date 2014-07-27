var scheduleGeneratingPdfForReservation = require('./pdf_forms').scheduleGeneratingPdfForReservation;
var scheduleSendingReservationEmail = require('./send_mail').scheduleSendingEmailAfterRegistration;

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
        return dbQuery({sql: 'SELECT * FROM reservations LEFT JOIN customers ON reservations.customer_id = customers.id LEFT JOIN cars ON reservations.car_id = cars.id WHERE reservations.start >= DATE(NOW())', nestTables: true}).then(function(rows) {
          return rows.map(function(row) {
            row.reservations.customer = row.customers;
            row.reservations.car = row.cars;

            return row.reservations;
          }).map(formatReservationDates);
        });
      }
    },

    'POST': {
      inject:          [DbQuery, RequestBody],
      handler: function(dbQuery, reservation) {
        // TODO(vojta): read user_id from auth
        reservation.created_by = 1;

        function insertReservation(reservation) {
          return dbQuery('INSERT INTO reservations SET ?, created_at = NOW(), updated_at = NOW()', reservation).then(function(result) {
            scheduleGeneratingPdfForReservation(dbQuery, result.insertId).done();
            scheduleSendingReservationEmail().then(function() {
              console.log('EMAIL SENT OK');
            }, function(err) {
              console.log('email fail', err)
            }).done();
            return {
              id:result.insertId
            };
          });
        }

        if (reservation.customer) {
          return dbQuery('INSERT INTO customers SET ?', reservation.customer).then(function(result) {
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
        return dbQuery('SELECT reservations.*, cars.name AS car_name FROM reservations LEFT JOIN cars ON reservations.car_id = cars.id WHERE reservations.id = ?', id)
          .then(takeOneRow).then(formatReservationDates);
      }
    },

    'DELETE': {
      inject:          [DbQuery, PathParam('id')],
      handler: function(dbQuery, id) {
        return dbQuery('DELETE FROM reservations WHERE id = ?', id);
      }
    },

    'PUT': {
      inject: [DbQuery, RequestBody],
      handler: function(dbQuery, reservation) {
        return dbQuery('UPDATE reservations SET ? WHERE id = ?', [reservation, reservation.id]);
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
