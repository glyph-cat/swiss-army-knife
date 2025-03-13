set -e

ECHO "Forwarding exports for core package..."
yarn --cwd ./src/packages/core afe

ECHO "Forwarding exports for react package..."
yarn --cwd ./src/packages/react afe

ECHO "Forwarding exports for playground..."
yarn afe-playground
