set -e

yarn afe core react # Auto forward exports

yarn lint

yarn build

yarn post-process-docs

yarn test

yarn pack-packages
