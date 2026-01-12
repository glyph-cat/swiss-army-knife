set -e

yarn lint
yarn test # since we are testing the source code, not the compiled one
yarn build
yarn pack
