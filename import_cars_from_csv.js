// TODO(vojta): normalize colors

var fs = require('fs');
var parse = require('csv-parse');

var mysql = require('mysql');
var pool  = mysql.createPool({
  debug: ['ComQueryPacket', 'RowDataPacket'],
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'api',
  password        : 'api',
  database: 'fleet_manager'
});

var input = fs.createReadStream(process.argv[2]);
var parser = parse({delimiter: ',', columns: [undefined, undefined, 'description', 'engine_displacement', 'vin', 'spz', undefined, 'model', undefined, undefined, 'color']}, function(err, cars) {

  // Filter out invalid cars.
  cars = cars.filter(function(car) {
    return car.description && car.model;
  });

  var normalizeModels = {
    'S60 R - D': 'S60',
    'XC70 D5 AWD': 'XC70',
    'XC 60': 'XC60'
  };

  // Insert models.
  var modelIdFor = Object.create(null);
  var pending = 0;
  cars.forEach(function(car) {
    car.model = car.model.trim();
    if (normalizeModels[car.model]) {
      car.model = normalizeModels[car.model];
    }

    if (!modelIdFor[car.model]) {
      pending++;
      modelIdFor[car.model] = true;

      pool.query('INSERT INTO car_models SET ?', {name: car.model}, function(err, result) {
        if (err) {
          throw err;
        }

        modelIdFor[car.model] = result.insertId;
        pending--;

        if (pending === 0) {
          // Insert all cars.
          cars.forEach(function(car) {
            car.model_id = modelIdFor[car.model];
            car.engine_displacement = parseInt(car.engine_displacement, 10);
            car.spz = car.spz.replace(/\s/, '').substr(0, 7);
            car.vin = car.vin.trim();
            delete car.model;
            delete car.undefined;

            pool.query('INSERT INTO cars SET ?', car, function(err, result) {
              if (err) {
                console.log(car);
                throw err;
              }
              pending--;

              if (pending === 0) {
                console.log('DONE')
                process.exit();
              }

            });
            pending++;
          });
        }
      });
    }
  });
});

input.pipe(parser)
