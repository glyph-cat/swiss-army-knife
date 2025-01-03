set -e

ECHO "Linting './packages/core'..."
yarn --cwd ./packages/core lint

ECHO "Linting './packages/react'..."
yarn --cwd ./packages/react lint
