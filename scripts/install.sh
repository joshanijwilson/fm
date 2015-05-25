# Requires:
# - node, npm, bower, gulp
# - mysqladmin, running MySQL
# - gradle

PROJECT_DIR=$(cd "$(dirname $(dirname "${BASH_SOURCE[0]}" ))" && pwd)

# Create DB.
mysqladmin -u root create fleet_manager

# Create storage directories.
cd $PROJECT_DIR/storage
mkdir reservations

# Decode prod config.
cd $PROJECT_DIR
./scripts/decode_prod_config.sh


# Build everything, install deps, etc.
cd $PROJECT_DIR
./scripts/update.sh

# Insert cars from csv.
node scripts/import_cars_from_csv.js scripts/cars_new.csv
