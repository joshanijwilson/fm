var excelBuilder = require('./excel_builder');
var moment = require('moment');
var q = require('q');

var diExpress = require('./di_express');
var inject = diExpress.inject;
var DbQuery = diExpress.DbQuery;

var MONTHS = [
  'Leden',
  'Únor',
  'Březen',
  'Duben',
  'Květen',
  'Červen',
  'Červenec',
  'Srpen',
  'Září',
  'Říjen',
  'Listopad',
  'Prosinec'
];


// TODO: More-less copied from client/src/reserve/reserve_controller.js, reuse?
var REASON_OPTIONS = [
  null,
  'Vyzkoušení vlastností modelu před koupí',
  'Testovací jízdy za účelem zveřejnění výsledků testování', // Marketing
  'Náhradní vozidlo',
  'Služební vozidlo, jiná zápůjčka' // Jiny duvod.
];

var PREVIOUS_NOT_FILLED_OUT = function() {}; // fake fn - unique constant

function cell(value) {
  return {value: value};
}

function headerCell(text) {
  return {value: text, fontStyle: {bold: true}, fillStyle: {type: 'solid', fgColor: 'B3B3B3'}};
}

function carInfoCell(text) {
  return {value: text, fontStyle: {bold: true}, fillStyle: {type: 'solid', fgColor: 'FBF40C'}};
}

function dateCell(date) {
  return {value: moment(date).format('DD.MM.YYYY'), fontStyle: {bold: true}, fillStyle: {type: 'solid', fgColor: 'FFC30A'}};
}

function sumCell(value) {
  return {value: value, fontStyle: {bold: true}, fillStyle: {type: 'solid', fgColor: 'FEC087'}}
}

function equalDates(a, b) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getYear() === b.getYear();
}

function isLastDayOfReservation(reservation, date) {
  return equalDates(reservation.end, date);
}

// Expects sorted reservations.
function reservationByDate(reservations, date) {
  for (var i = 0, ii = reservations.length; i < ii; i++) {
    if (date < reservations[i].start) {
      // Date is before first reservation.
      return null;
    }
    if (reservations[i].start <= date && date <= reservations[i].end) {
      // Date is during this reservations.
      return reservations[i];
    }
  }

  // Date is in after all reservations.
  return null;
}


// TODO: Copied from api.js, reuse
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


inject(CarBooks, DbQuery);
function CarBooks(dbQuery) {
  this.bookFor = function(carId, year) {
    return q.all([
          dbQuery({sql: 'SELECT reservations.*, users.*, dealerships.* FROM reservations LEFT JOIN users ON reservations.created_by = users.id LEFT JOIN dealerships ON users.dealership_id = dealerships.id WHERE car_id = ? ORDER BY reservations.start ASC', values: [carId], nestTables: true}),
          dbQuery('SELECT * FROM cars WHERE id = ?', [carId]).then(takeOneRow)
      ]).then(function(rows) {
      // TODO: this is already in api.js, reuse?
      var reservations = rows[0].map(function(row) {
        var reservation = row.reservations;
        reservation.user = row.users;
        reservation.user.dealership = row.dealerships;
        return reservation;
      });
      var car = rows[1];
      var data = {
        sheets: []
      };

      MONTHS.forEach(function(month, monthZeroBasedNumber) {
        var sheet = {
          title: month + ' ' + year,
          rows: []
        };

        // Car info header:
        sheet.rows.push([headerCell('Číslo'), headerCell('Typ'), headerCell('SPZ'), headerCell('Přiháš.'), headerCell('Odhláš.')]);
        sheet.rows.push([carInfoCell(''), carInfoCell(car.name), carInfoCell(car.spz), carInfoCell(''), carInfoCell('v provozu')]);
        sheet.rows.push([]);

        // Header:
        sheet.rows.push([headerCell('Datum'), headerCell('Místo'), headerCell('Účel'), headerCell('Služ. Km'), headerCell('Soukr. Km'), headerCell(''), headerCell('Osoba'), headerCell('Podpis')]);

        // Actual data, for each day of the month:
        var date = new Date(year, monthZeroBasedNumber, 1);
        var tachometerAfterPreviousReservation = 0;
        var totalKmForMonth = 0;
        var row, reservation, reason, totalKm, driver;
        while (date.getMonth() === monthZeroBasedNumber) {
          row = []
          reservation = reservationByDate(reservations, date);
          reason = null;
          totalKm = null;
          driver = null;

          if (reservation) {
            reason = REASON_OPTIONS[reservation.reason] || '';
            driver = reservation.user.first_name + ' ' + reservation.user.last_name + ' - ' + reservation.user.dealership.name;

            if (isLastDayOfReservation(reservation, date)) {
              if (reservation.tachometer_end === null) {
                totalKm = 'chybí';
                tachometerAfterPreviousReservation = PREVIOUS_NOT_FILLED_OUT;
              } else if (tachometerAfterPreviousReservation === PREVIOUS_NOT_FILLED_OUT) {
                totalKm = 'předešlá rezervace chybí';
              } else {
                totalKm = reservation.tachometer_end - tachometerAfterPreviousReservation;
                tachometerAfterPreviousReservation = reservation.tachometer_end;
                totalKmForMonth += totalKm;
              }
            }
          } else {
            reason = 'Stálo';
          }

          sheet.rows.push([dateCell(date), cell('Praha'), cell(reason), cell(''), cell(''), cell(totalKm), cell(driver), cell('')]);
          date.setDate(date.getDate() + 1);
        }

        // Sum:
        sheet.rows.push([]);
        sheet.rows.push([]);
        sheet.rows.push([sumCell('Celkem'), sumCell(''), sumCell(''), sumCell(''), sumCell(''), sumCell(totalKmForMonth), sumCell(''), sumCell('')]);

        data.sheets.push(sheet);
      });

      return excelBuilder.generateFile(data);
    });
  };
}

module.exports = CarBooks;

// For testing.
CarBooks.reservationByDate = reservationByDate;
