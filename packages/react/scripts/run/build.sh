set -e

yarn clean
yarn rollup
yarn types
yarn api

rm -r ./temp/tsc
