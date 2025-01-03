set -e

ECHO "Building './packages/core'..."
yarn --cwd ./packages/core build

ECHO "Building './packages/react'..."
yarn --cwd ./packages/react build
