set -e

yarn --cwd ../../.. check-deps

# Cleanup old artifacts
rm -rf ./lib ./temp/tsc

# Actual build process
yarn bundle && yarn types && yarn api
