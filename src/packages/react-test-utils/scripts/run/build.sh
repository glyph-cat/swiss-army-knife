set -e

yarn clean
yarn rollup
yarn types
yarn api
