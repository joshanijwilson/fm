# Install test DB.
# mysqladmin -u root create fleet_manager_test
FM_ENV=test ../db/node_modules/db-migrate/bin/db-migrate --config ../db/config.js --migrations-dir ../db/migrations/ up

FM_ENV=test node ../scripts/import_cars_from_csv.js ../scripts/cars_new.csv
