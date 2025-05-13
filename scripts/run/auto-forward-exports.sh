set -e

ECHO "Forwarding exports for 'core' package..."
yarn --cwd ./src/packages/core afe

ECHO "Forwarding exports for 'react' package..."
yarn --cwd ./src/packages/react afe

ECHO "Forwarding exports for 'react-test-utils'..."
yarn --cwd ./src/packages/react-test-utils afe

ECHO "Forwarding exports for 'cli-parameter-parser'..."
yarn --cwd ./src/packages/cli-parameter-parser afe

ECHO "Forwarding exports for 'ml-helpers'..."
yarn --cwd ./src/packages/ml-helpers afe

ECHO "Forwarding exports for 'project-helpers'..."
yarn --cwd ./src/packages/project-helpers afe

ECHO "Forwarding exports for playground..."
yarn afe-playground
