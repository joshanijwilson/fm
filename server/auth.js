var bcrypt = require('bcrypt');
var q = require('q');
var jwt = require('jsonwebtoken');

var config = require('../config').forCurrentEnvironment();
var diExpress = require('./di_express');
var DbQuery = diExpress.DbQuery;
var RequestBody = diExpress.RequestBody;
var Request = diExpress.Request;
var inject = diExpress.inject;
var providePromise = diExpress.providePromise;

var hashPassword = q.nbind(bcrypt.hash, bcrypt);
var checkPassword = q.nbind(bcrypt.compare, bcrypt);

function InvalidEmailError(message) {
  Error.call(this);

  this.status = 404;
  this.code = 'invalid_email';
  this.message = message || null;
}

InvalidEmailError.prototype = Object.create(Error.prototype);

function IncorrectPasswordError(message) {
  Error.call(this);

  this.status = 404;
  this.code = 'incorrect_password';
  this.message = message || null;
}

IncorrectPasswordError.prototype = Object.create(Error.prototype);

exports.routes = {
  '/auth/local': {
    'POST': {
      inject: [DbQuery, RequestBody],
      handler: function(dbQuery, input) {
        return dbQuery('SELECT * FROM users WHERE email = ?', input.email).then(function(rows) {
          if (rows.length === 0) {
            throw new InvalidEmailError('Invalid email. User is not allowed to register.');
          }

          var user = rows[0];
          var generateToken = function() {
            return {
              id: user.id,
              is_admin: !!user.is_admin,
              token: jwt.sign({id: user.id}, config.authSecret, { expiresInMinutes: 60*24*7 })
            };
          };

          // First time. Set the password.
          if (user.password_hash === null) {
            return hashPassword(input.password, 8).then(function(hash) {
              return dbQuery('UPDATE users SET password_hash = ? WHERE id = ?', [hash, user.id]).then(generateToken);
            });
          }

          // The user already has a password.
          // Check if the password is correct.
          return checkPassword(input.password, user.password_hash).then(function(match) {
            if (!match) {
              throw new IncorrectPasswordError();
            }

            return generateToken();
          });
        });
      }
    }
  }
};

inject(AuthenticatedUser, DbQuery, getAuthenticatedUserId);
providePromise(AuthenticatedUser, AuthenticatedUser);
function AuthenticatedUser(dbQuery, id) {
  return dbQuery('SELECT * FROM users WHERE id = ?', id);
}

// This function name starts lowercase to trick the DI to call it as a factory
// (instead of constructor with new).
// The req.user is parsed from the authorization token by express-jwt middleware.
inject(getAuthenticatedUserId, Request);
function getAuthenticatedUserId(req) {
  if (!req.user) {
    throw new Error('Not authenticated.');
  }

  return req.user.id;
}

exports.AuthenticatedUser = AuthenticatedUser;
exports.AuthenticatedUserId = getAuthenticatedUserId;
