set -e

# Run `yarn build` on the packages with a specific sequence.

ECHO "Building './packages/core'..."
yarn --cwd ./packages/core build

ECHO "Building './packages/react'..."
yarn --cwd ./packages/react build
