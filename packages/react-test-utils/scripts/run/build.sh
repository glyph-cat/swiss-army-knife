set -e

pnpm run clean
pnpm run bundle
pnpm run types
pnpm run api
