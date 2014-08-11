var scheduleGeneratingPdfForReservation = require('./pdf_forms').scheduleGeneratingPdfForReservation;
var EmailScheduler = require('./email_scheduler');

var diExpress = require('./di_express');
var DbQuery = diExpress.DbQuery;
var RequestBody = diExpress.RequestBody;
var PathParam = diExpress.PathParam;


function Error404(msg) {
  this.status = 404;
  this.code = null;
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

function mergeCustomerAndCarIntoReservation(row) {
  row.reservations.car = row.cars;
  row.reservations.customer = row.customers;

  return row.reservations;
}

var auth = require('./auth');
var AuthUser = auth.AuthenticatedUser;

exports.routes = {
  '/reservations': {

    'GET': {
      inject:          [DbQuery],
      handler: function(dbQuery) {
        return dbQuery({sql: 'SELECT * FROM reservations LEFT JOIN customers ON reservations.customer_id = customers.id LEFT JOIN cars ON reservations.car_id = cars.id WHERE reservations.start >= DATE(NOW()) AND reservations.finished_at IS NULL', nestTables: true}).then(function(rows) {
          return rows.map(mergeCustomerAndCarIntoReservation).map(formatReservationDates);
        });
      }
    },

    'POST': {
      inject:          [DbQuery, RequestBody, AuthUser, EmailScheduler],
      handler: function(dbQuery, reservation, user, scheduleEmail) {
        reservation.created_by = user.id;

        function insertReservation(reservation) {
          return dbQuery('INSERT INTO reservations SET ?, created_at = NOW(), updated_at = NOW()', reservation).then(function(result) {
            scheduleGeneratingPdfForReservation(dbQuery, result.insertId).done();
            scheduleEmail.reservationCreated(result.insertId);

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
        return dbQuery({sql: 'SELECT * FROM reservations LEFT JOIN cars ON reservations.car_id = cars.id LEFT JOIN customers ON reservations.customer_id = customers.id WHERE reservations.id = ?', nestTables: true, values: id})
          .then(takeOneRow).then(mergeCustomerAndCarIntoReservation).then(formatReservationDates);
      }
    },

    // TODO(vojta): only allow user's reservation or if admin
    'DELETE': {
      inject:          [DbQuery, PathParam('id')],
      handler: function(dbQuery, id) {
        return dbQuery('DELETE FROM reservations WHERE id = ?', id);
      }
    },

    // TODO(vojta): only allow user's reservation or if admin
    'PUT': {
      inject: [DbQuery, RequestBody, EmailScheduler],
      handler: function(dbQuery, reservation, scheduleEmail) {
        if (reservation.finished_at === 'NOW') {
          reservation.finished_at = new Date();
        }

        return dbQuery('UPDATE reservations SET ? WHERE id = ?', [reservation, reservation.id]).then(function() {
          scheduleEmail.reservationFinished(reservation.id);
        });
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
