set -e

yarn afe
yarn lint
yarn build
yarn test
yarn pack
