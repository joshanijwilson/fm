var bcrypt = require('bcrypt');
var q = require('q');
var jwt = require('jsonwebtoken');

var diExpress = require('./di-express');
var DbQuery = diExpress.DbQuery;
var RequestBody = diExpress.RequestBody;

var AUTH_TOKEN_SECRET = 'fuck';

var hashPassword = q.nbind(bcrypt.hash, bcrypt);
var checkPassword = q.nbind(bcrypt.compare, bcrypt);

exports.routes = {
  '/auth/local': {
    'POST': {
      inject: [DbQuery, RequestBody],
      handler: function(dbQuery, input) {
        return dbQuery('SELECT * FROM users WHERE email = ?', input.email).then(function(rows) {
          if (rows.length === 0) {
            // TODO(vojta): set proper status code.
            throw new Error('Invalid email. User is not allowed to register.');
          }

          var user = rows[0];
          var generateToken = function() {
            return {
              token: jwt.sign({id: user.id}, AUTH_TOKEN_SECRET, { expiresInMinutes: 60*24*7 })
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
              throw new Error('Incorrect password.');
            }

            return generateToken();
          });
        });
      }
    }
  }
};
