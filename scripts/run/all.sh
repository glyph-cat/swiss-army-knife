set -e

yarn afe # Auto forward exports

yarn lint

yarn build

yarn post-process-docs

yarn test

yarn pack
