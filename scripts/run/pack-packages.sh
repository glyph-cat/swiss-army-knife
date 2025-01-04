set -e

ECHO "Packing core package..."
yarn --cwd ./packages/core pack

ECHO "Packing react package..."
yarn --cwd ./packages/react pack
