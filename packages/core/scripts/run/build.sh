set -e

yarn clean
yarn css-enums
yarn rollup
yarn types
yarn api

rm -r ./temp/tsc
