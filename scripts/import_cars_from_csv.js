// TODO(vojta): normalize colors

var fs = require('fs');
var parse = require('csv-parse');

var config = require('../config').forCurrentEnvironment();
var mysql = require('mysql');
var pool  = mysql.createPool(config.mysql);

var input = fs.createReadStream(process.argv[2]);
// var COLUMNS = [undefined, undefined, 'name', 'engine_displacement', 'vin', 'spz', undefined, 'model', undefined, undefined, 'color'];
var COLUMNS = ['model', 'model_year', 'name', 'spz', 'equipment', 'transmission'];
var parser = parse({delimiter: ',', columns: COLUMNS}, function(err, cars) {

  // Filter out invalid cars.
  cars = cars.filter(function(car) {
    return car.name && car.model;
  });

  var normalizeModels = {
    'S60 R - D': 'S60',
    'XC70 D5 AWD': 'XC70',
    'XC 60': 'XC60'
  };

  var equipmentMap = {
    'Kinetic':  1,
    'Momentum': 2,
    'Summum':   3,
    'R-Design': 4
  };

  var carIdForSpz = Object.create(null);
  var modelIdFor = Object.create(null);

  function insertCars(cars) {
    var pending = 0;

    cars.forEach(function(car) {
      pending++;

      car.model_id = modelIdFor[car.model];
      car.engine_displacement = car.engine_displacement && parseInt(car.engine_displacement, 10) || 0;
      car.spz = car.spz.replace(/\s/, '').substr(0, 7);
      car.vin = car.vin && car.vin.trim() || 0;
      car.equipment = equipmentMap[car.equipment] || 0;
      car.is_active = 1;
      car.photo_url = '/storage/cars/' + car.spz.toLowerCase() + '.jpg';
      delete car.model;
      delete car.undefined;

      // Car already exists in the DB, update.
      if (car.spz && carIdForSpz[car.spz]) {
        console.log('Updating existing car ' + car.name + ' (' + carIdForSpz[car.spz] + ')');
        pool.query('UPDATE cars SET ? WHERE id = ?', [car, carIdForSpz[car.spz]], function(err, result) {
          if (err) {
            console.erro('Failed to update car ' + car.name + ' (' + car.id + ')');
            console.error(car);
            console.error(err);
          }
          pending--;

          if (pending === 0) {
            console.log('DONE');
            process.exit();
          }
        });
      } else {
        console.log('Inserting new car ' + car.name);
        pool.query('INSERT INTO cars SET ?', car, function(err, result) {
          if (err) {
            console.error('Failed to insert new car ' + car.name);
            console.error(car);
            console.error(err);
          }
          pending--;

          if (pending === 0) {
            console.log('DONE')
            process.exit();
          }

        });
      }
    });
  }

  // Load existing models.
  pool.query('SELECT id,name FROM car_models', function(err, rows) {
    if (err) {
      console.error(err);
      throw err;
    }

    rows.forEach(function(row) {
      modelIdFor[row.name] = row.id;
    });

    // Load existing cars.
    pool.query('SELECT id,spz FROM cars', function(err, rows) {
      if (err) {
        console.error(err);
        throw err;
      }

      rows.forEach(function(row) {
        carIdForSpz[row.spz] = row.id;
      });

      pool.query('UPDATE cars SET is_active = 0', function(err, rows) {
        if (err) {
          console.error('Failed to deactivate old cars.');
        }

        // Insert models that don't exist yet.
        var pending = 0;

        cars.forEach(function(car) {
          car.model = car.model.trim();
          if (normalizeModels[car.model]) {
            car.model = normalizeModels[car.model];
          }

          if (!modelIdFor[car.model]) {
            pending++;
            modelIdFor[car.model] = true;

            console.log('Inserting new car model ' + car.model);
            pool.query('INSERT INTO car_models SET ?', {name: car.model}, function(err, result) {
              if (err) {
                console.error('Failed to insert new car model ' + car.model);
                console.error(err);
                throw err;
              }

              modelIdFor[car.model] = result.insertId;
              pending--;

              if (pending === 0) {
                insertCars(cars);
              }
            });
          }
        });

        if (pending === 0) {
          insertCars(cars);
        }
      });
    });
  });
});

input.pipe(parser);
