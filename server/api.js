var scheduleGeneratingPdfForReservation = require('./pdf_forms').scheduleGeneratingPdfForReservation;
var EmailScheduler = require('./email_scheduler');

var diExpress = require('./di_express');
var inject = diExpress.inject;
var DbQuery = diExpress.DbQuery;
var RequestBody = diExpress.RequestBody;
var PathParam = diExpress.PathParam;
var PathParams = diExpress.PathParams;

var auth = require('./auth');
var AuthUser = auth.AuthenticatedUser;

var Calendar = require('./calendar');


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

function mergeCustomerAndUserAndCarIntoReservation(row) {
  var reservation = row.reservations;
  reservation.car = row.cars;
  reservation.customer = row.customers;
  reservation.user = row.users;
  reservation.user.dealership_name = row.dealerships.name;

  return reservation;
}

inject(CheckUserHasPermissions, AuthUser);
function CheckUserHasPermissions(user) {
  return function checkUserPermission(reservation) {
    if (!user.is_admin && user.id !== reservation.created_by) {
      throw new ForbiddenError('Insufficient permissions.');
    }
  };
}


exports.routes = {
  '/reservations': {

    'GET': {
      inject:          [DbQuery, PathParams, AuthUser],
      handler: function(dbQuery, params, authUser) {
        var criteria = [];

        if (params.car_id) {
          criteria.push('reservations.car_id = ' + parseInt(params.car_id));
        }
        if (params.finished_at === 'null') {
          criteria.push('reservations.finished_at IS NULL');
        }
        if (!authUser.is_admin) {
          criteria.push('reservations.created_by = ' + authUser.id);
        }

        return dbQuery({sql: 'SELECT * FROM reservations LEFT JOIN customers ON reservations.customer_id = customers.id LEFT JOIN cars ON reservations.car_id = cars.id LEFT JOIN users ON reservations.created_by = users.id LEFT JOIN dealerships ON users.dealership_id = dealerships.id WHERE ' + criteria.join(' AND ') + ' ORDER BY reservations.created_at DESC', nestTables: true}).then(function(rows) {
          return rows.map(mergeCustomerAndUserAndCarIntoReservation).map(formatReservationDates);
        });
      }
    },

    'POST': {
      inject:          [DbQuery, RequestBody, AuthUser, EmailScheduler, Calendar],
      handler: function(dbQuery, reservation, user, scheduleEmail, calendar) {
        reservation.created_by = user.id;

        function insertReservation(reservation) {
          return dbQuery('INSERT INTO reservations SET ?, created_at = NOW(), updated_at = NOW()', reservation).then(function(result) {
            scheduleGeneratingPdfForReservation(dbQuery, result.insertId).then(function() {
              scheduleEmail.reservationCreated(result.insertId).done();
            }).done();
            calendar.reservationCreated(result.insertId).done();
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
        return dbQuery({sql: 'SELECT * FROM reservations LEFT JOIN cars ON reservations.car_id = cars.id LEFT JOIN customers ON reservations.customer_id = customers.id LEFT JOIN users ON reservations.created_by = users.id LEFT JOIN dealerships ON users.dealership_id = dealerships.id WHERE reservations.id = ?', nestTables: true, values: id})
          .then(takeOneRow)
          .then(mergeCustomerAndUserAndCarIntoReservation)
          .then(formatReservationDates);
      }
    },

    'DELETE': {
      inject:          [DbQuery, PathParam('id'), CheckUserHasPermissions],
      handler: function(dbQuery, id, checkUserHasPermissions) {
        return dbQuery('SELECT created_by FROM reservations WHERE id = ?', id)
          .then(takeOneRow)
          .then(checkUserHasPermissions)
          .then(function() {
            return dbQuery('DELETE FROM reservations WHERE id = ?', id);
        });
      }
    },

    'PUT': {
      inject: [DbQuery, PathParam('id'), RequestBody, CheckUserHasPermissions, EmailScheduler, AuthUser],
      handler: function(dbQuery, id, reservation, checkUserHasPermissions, scheduleEmail, user) {
        return dbQuery('SELECT created_by FROM reservations WHERE id = ?', id)
          .then(takeOneRow)
          .then(checkUserHasPermissions)
          .then(function() {
            if (reservation.finished_at === 'NOW') {
              if (!user.is_admin) {
                throw new ForbiddenError('Insufficient permissions.');
              }

              reservation.finished_at = new Date();
              reservation.finished_by = user.id;
            }

            return dbQuery('UPDATE reservations SET ? WHERE id = ?', [reservation, id]);
        });
      }
    }
  },


  '/cars': {

    'GET': {
      inject: [DbQuery],
      handler: function(dbQuery) {
        return dbQuery('SELECT cars.*, car_models.name AS model_name FROM cars LEFT JOIN car_models ON cars.model_id = car_models.id WHERE cars.is_active = 1');
      }
    }
  }
};
