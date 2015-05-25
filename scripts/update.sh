# Requires:
# - node, npm, bower, gulp
# - running MySQL
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


# Migrate the DB.
cd $PROJECT_DIR
./db/node_modules/db-migrate/bin/db-migrate --config db/config.js --migrations-dir db/migrations/ up


# Build PDF generator.
cd $PROJECT_DIR/pdf_generator
gradle fatJar


# Build client.
cd $PROJECT_DIR/client
gulp build build.min
