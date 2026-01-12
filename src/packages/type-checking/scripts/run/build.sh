set -e

yarn clean
yarn bundle
yarn types
yarn api

rm -r ./temp/tsc
