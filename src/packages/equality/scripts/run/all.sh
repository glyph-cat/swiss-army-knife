set -e

yarn lint
yarn build
yarn test
yarn pack
