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

function ForbiddenError(message) {
  Error.call(this);

  this.status = 403;
  this.code = 'forbidden';
  this.message = message || null;
}

ForbiddenError.prototype = Object.create(Error.prototype);


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

    'DELETE': {
      inject:          [DbQuery, PathParam('id'), AuthUser],
      handler: function(dbQuery, id, user) {
        return dbQuery('SELECT created_by FROM reservations WHERE id = ?', id).then(function(rows) {
          if (!rows.length) {
            throw new Error404('Record does not exist.');
          }

          if (user.is_admin || user.id === rows[0].created_by) {
            return dbQuery('DELETE FROM reservations WHERE id = ?', id);
          }

          throw new ForbiddenError('Insufficient permissions.');
        });
      }
    },

    'PUT': {
      inject: [DbQuery, PathParam('id'), RequestBody, EmailScheduler, AuthUser],
      handler: function(dbQuery, id, reservation, scheduleEmail, user) {
        return dbQuery('SELECT created_by FROM reservations WHERE id = ?', id).then(function(rows) {
          if (!rows.length) {
            throw new Error404('Record does not exist.');
          }

          if (user.is_admin || user.id === rows[0].created_by) {
            if (reservation.finished_at === 'NOW') {
              reservation.finished_at = new Date();
            }
            console.log(reservation)
            return dbQuery('UPDATE reservations SET ? WHERE id = ?', [reservation, id]).then(function() {
              scheduleEmail.reservationFinished(id);
            });
          }

          throw new ForbiddenError('Insufficient permissions.');
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
