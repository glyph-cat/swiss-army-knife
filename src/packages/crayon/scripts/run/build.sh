set -e

yarn --cwd ../../.. check-deps

# yarn clean
yarn bundle
yarn types
yarn api
