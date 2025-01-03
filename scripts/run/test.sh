set -e

ECHO "Testing './packages/core'..."
yarn --cwd ./packages/core test

ECHO "Testing './packages/react'..."
yarn --cwd ./packages/react test
