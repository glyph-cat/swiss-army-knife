set -e

yarn clean
yarn bundle
yarn types
yarn api

yarn tsx ./scripts/run/inspect-build

rm -r ./temp/tsc
