set -e

ECHO "Running tests for core package..."
yarn --cwd ./src/packages/core test

ECHO "Running tests for react package..."
yarn --cwd ./src/packages/react test
