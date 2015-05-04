# Requires:
# - node, npm, bower, gulp
# - mysqladmin, running MySQL
# - gradle

PROJECT_DIR=$(cd "$(dirname $(dirname "${BASH_SOURCE[0]}" ))" && pwd)

# Install all NPM packages.
for location in $PROJECT_DIR/*; do
  if [ -e "$location/package.json" ]; then
    echo "Installing NPM packages in $location"
    cd $location
    npm install
  fi
done

# Install bower packages.
cd $PROJECT_DIR/client
bower install


# Install DB.
cd $PROJECT_DIR
mysqladmin -u root create fleet_manager
./db/node_modules/db-migrate/bin/db-migrate --config db/config.js --migrations-dir db/migrations/ up

# Insert cars from csv.
node scripts/import_cars_from_csv.js scripts/cars_new.csv


# Build PDF generator.
cd $PROJECT_DIR/pdf_generator
gradle fatJar

# Build client.
cd $PROJECT_DIR/client
gulp build build.min

