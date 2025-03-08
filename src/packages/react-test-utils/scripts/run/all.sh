set -e

yarn clean
yarn lint
yarn build
yarn test
yarn pack
