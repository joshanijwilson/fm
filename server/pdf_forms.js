var exec = require('child_process').exec;
var moment = require('moment');


// Mapping values from model to survey-empty.pdf form.
function getSurveyFields(car) {
  return {
    // Model
    'Text1': car.model_name,

    // Equipment
    // 'Text2': car.equipment,

    // Engine
    // 'Text3': car.engine,

    // Model Year
    'Text4': car.model_year,

    // Transmission
    'Text5': car.transmission,
  };
}

// Mapping values from model to reservation-protocol-empty.pdf
function getReservationProtocolFields(reservation, car, customer) {
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
    'untitled9': customer.first_name + ' ' + customer.last_name,

    // Phone
    'untitled10': customer.phone || '',

    // Company
    'untitled11': customer.company || '',

    // Address
    'untitled12': customer.address || '',

    // Datum predani (start)
    'untitled13': moment(reservation.start).format('D.M.YY'),

    // Hodina predani (start)
    // 'untitled14': null,

    // Datum vraceni
    'untitled15': moment(reservation.end).format('D.M.YY'),

    // Hodina vraceni
    // 'untitled16': null,

    // Tachometr (start)
    // 'untitled17': null,

    // Palivomer (start)
    // 'untitled18': null,

    // Poskozeni (start)
    // 'untitled19': null,


    // Reason
    // Vyzkouseni pred koupi
    'untitled25': reservation.reason === 1 ? 'Yes' : 'No',

    // Testovani za ucelem zverejneni vysledku testovani
    'untitled26':  reservation.reason === 2 ? 'Yes' : 'No',

    // Nahradni vozidlo
    'untitled27':  reservation.reason === 3 ? 'Yes' : 'No',

    // Sluzebni vozidlo, jina zapujcka
    'untitled28':  reservation.reason === 4 ? 'Yes' : 'No',

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
  exec(FILL_PDF_CMD + ' --input ' + inputFile + ' --output ' + outputFile + ' --fields \'' + JSON.stringify(fields) + '\'', function() {
    console.log('EXEC done', arguments);
  });
}

exports.generateProtocol = function(reservation, car, customer) {
  // // TODO(vojta): super lame, fix it.
  exec('mkdir -p ./storage/reservations/' + reservation.id);

  generatePdf('./server/reservation-protocol-empty.pdf', './storage/reservations/' + reservation.id + '/protocol.pdf', getReservationProtocolFields(reservation, car, customer));
};


exports.generateSurvey = function(reservation, car) {
  generatePdf('./server/survey-empty.pdf', './storage/reservations/' + reservation.id + '/survey.pdf', getSurveyFields(car));
};
