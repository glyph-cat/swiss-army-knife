set -e

ECHO "Forwarding exports for core package..."
yarn --cwd ./packages/core afe

ECHO "Forwarding exports for react package..."
yarn --cwd ./packages/react afe
