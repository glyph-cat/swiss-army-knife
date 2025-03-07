set -e

ECHO "Packing core package..."
yarn --cwd ./src/packages/core pack

ECHO "Packing react package..."
yarn --cwd ./src/packages/react pack
