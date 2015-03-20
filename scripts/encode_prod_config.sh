#!/bin/bash

PROJECT_DIR=$(cd "$(dirname $(dirname "${BASH_SOURCE[0]}" ))" && pwd)

cd $PROJECT_DIR
openssl aes-256-cbc -a -salt -in config/prod_env.json -out config/prod_env.json.enc
