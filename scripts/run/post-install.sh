set -e

ECHO "Installing dependencies for core package..."
yarn --cwd ./packages/core install

ECHO "Installing dependencies for react package..."
yarn --cwd ./packages/react install
