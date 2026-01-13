set -e

ECHO "Running all scripts for foundation package..."
yarn --cwd ./src/packages/foundation all

ECHO "Running all scripts for core package..."
yarn --cwd ./src/packages/core all

ECHO "Running all scripts for react package..."
yarn --cwd ./src/packages/react all
