// This runs as a cron job, every night at 8pm GMT+1.
// Check all pending reservations and send out reminders for the reservations that end tomorrow.

var mysql = require('mysql');
var di = require('di');

var ReservationReminder = require('./reservation_reminder');
var config = require('../config').forCurrentEnvironment();
var pool = mysql.createPool(config.mysql);

var diExpress = require('./di_express');
var DbQuery = diExpress.DbQuery;
var DbPool = diExpress.DbPool;

function endPool() {
  pool.end();
}

var injector = new di.Injector([
  diExpress.bind(DbPool).toValue(pool)
]);

console.log(new Date(), 'Checking reservations...');
injector.get(ReservationReminder).sendReminders().done(endPool, endPool);
