set -e

ECHO "Forwarding exports for 'foundation'..."
yarn --cwd ./src/packages/foundation afe

ECHO "Forwarding exports for 'core'..."
yarn --cwd ./src/packages/core afe

ECHO "Forwarding exports for 'react'..."
yarn --cwd ./src/packages/react afe

ECHO "Forwarding exports for 'equality'..."
yarn --cwd ./src/packages/equality afe

ECHO "Forwarding exports for 'localization'..."
yarn --cwd ./src/packages/localization afe

# ECHO "Forwarding exports for 'localization-react'..."
# yarn --cwd ./src/packages/localization-react afe

ECHO "Forwarding exports for 'cleanup-manager'..."
yarn --cwd ./src/packages/cleanup-manager afe

ECHO "Forwarding exports for 'react-test-utils'..."
yarn --cwd ./src/packages/react-test-utils afe

ECHO "Forwarding exports for 'cli-parameter-parser'..."
yarn --cwd ./src/packages/cli-parameter-parser afe

ECHO "Forwarding exports for 'ml-helpers'..."
yarn --cwd ./src/packages/ml-helpers afe

# ECHO "Forwarding exports for 'project-helpers'..."
# yarn --cwd ./src/packages/project-helpers afe

ECHO "Forwarding exports for playground..."
yarn afe-playground
