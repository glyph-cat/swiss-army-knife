set -e

ECHO "Running tests for core package..."
yarn --cwd ./packages/core test

ECHO "Running tests for react package..."
yarn --cwd ./packages/react test
