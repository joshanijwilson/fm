var exec = require('child_process').exec;
var moment = require('moment');
var q = require('q');

// TODO(vojta): This is copied like three times ;-)
var equipmentMap = {
  1: 'Kinetic',
  2: 'Momentum',
  3: 'Summum',
  4: 'R-Design'
};

function carEngineFromName(name) {
  return (name.match(/\w+\s([TD]\d)/) || [])[1] || '';
}

// Mapping values from model to survey-empty.pdf form.
function getSurveyFields(car) {
  return {
    // Model
    'Text1': car.model_name,

    // Equipment
    'Text2': equipmentMap[car.equipment],

    // Engine
    'Text3': carEngineFromName(car.name),

    // Model Year
    'Text4': car.model_year,

    // Transmission
    'Text5': car.transmission.substring(0, 3)
  };
}

// Mapping values from model to reservation-protocol-empty.pdf
function getReservationProtocolFields(reservation, car, dealer) {
  return {
    // Typ vozidla.
    'untitled3': car.name,

    // Vin
    'untitled5': car.vin,

    // SPZ
    'untitled6': car.spz,

    // Predane doklady
    // 'untitled7': null,

    // Vybava
    // 'untitled8': null,

    // Name
    'untitled9': dealer.first_name + ' ' + dealer.last_name,

    // Phone
    'untitled10': dealer.phone || '',

    // Company
    'untitled11': dealer.dealership_name || '',

    // Address
    'untitled12': '',

    // Datum predani (start)
    'untitled13': moment(reservation.start).format('D.M.YY'),

    // Hodina predani (start)
    'untitled14': '10:00',

    // Datum vraceni
    'untitled15': moment(reservation.end).format('D.M.YY'),

    // Hodina vraceni
    'untitled16': '12:00',

    // Tachometr (start)
    // 'untitled17': null,

    // Palivomer (start)
    // 'untitled18': null,

    // Poskozeni (start)
    // 'untitled19': null,


    // Reason
    // Vyzkouseni pred koupi
    'untitled25': reservation.reason === 1 ? 'Yes' : null,

    // Testovani za ucelem zverejneni vysledku testovani
    'untitled26':  reservation.reason === 2 ? 'Yes' : null,

    // Nahradni vozidlo
    'untitled27':  reservation.reason === 3 ? 'Yes' : null,

    // Sluzebni vozidlo, jina zapujcka
    'untitled28':  reservation.reason === 4 ? 'Yes' : null,

    // Dlohodoba (od-do)
    // 'untitled29': 'Yes',

    // Od (dlohodoba)
    // 'untitled32': null,

    // Do (dlouhodoba)
    // 'untitled33': null,

    // Where the car can be used?
    // CZ
    'untitled30': 'Yes',
    // EU
    'untitled31': 'Yes',


    // When returning the car.
    // Datum vraceni (end)
    // 'untitled20': null,

    // Tachometr (end)
    // 'untitled21': null,

    // Poskozeni (end)
    // 'untitled22': null,

    // Palivomer (end)
    // 'untitled23': null,

    // Hodina vraceni (end)
    // 'untitled24': null
  };
}

var FILL_PDF_CMD = 'java -jar ./pdf_generator/build/libs/pdf_generator-all-0.1.0.jar';


function generatePdf(inputFile, outputFile, fields) {
  var deferred = q.defer();

  // console.log(FILL_PDF_CMD + ' --input ' + inputFile + ' --output ' + outputFile + ' --fields \'' + JSON.stringify(fields) + '\'')
  exec(FILL_PDF_CMD + ' --input ' + inputFile + ' --output ' + outputFile + ' --fields \'' + JSON.stringify(fields) + '\'', function(err) {
    if (err) {
      return deferred.reject(err);
    }

    deferred.resolve(outputFile);
    console.log('EXEC done', arguments);
  });

  return deferred.promise;
}

function generateProtocol(reservation, car, customer) {
  return generatePdf('./server/reservation-protocol-empty.pdf', './storage/reservations/' + reservation.id + '-protocol.pdf', getReservationProtocolFields(reservation, car, customer));
};


function generateSurvey(reservation, car) {
  return generatePdf('./server/survey-empty.pdf', './storage/reservations/' + reservation.id + '-survey.pdf', getSurveyFields(car));
};


exports.scheduleGeneratingPdfForReservation = function(query, id) {
  return query({sql: 'SELECT * FROM reservations LEFT JOIN customers ON reservations.customer_id = customers.id LEFT JOIN cars ON reservations.car_id = cars.id LEFT JOIN car_models ON cars.model_id = car_models.id LEFT JOIN users ON reservations.created_by = users.id LEFT JOIN dealerships ON users.dealership_id = dealerships.id WHERE reservations.id = ?', values: id, nestTables: true}).then(function(rows) {
    var result = rows[0];

    // console.log('RESULT', result)
    result.cars.model_name = result.car_models.name;
    result.users.dealership_name = result.dealerships.name;

    console.log('GENERATING');
    return q.all([
      generateProtocol(result.reservations, result.cars, result.users),
      generateSurvey(result.reservations, result.cars)
    ]);
  }, function() {
    console.log('err', arguments)
  });
}
