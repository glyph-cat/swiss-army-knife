set -e

pnpm run clean
pnpm run bundle
pnpm run types
pnpm run api

pnpm exec tsx ./scripts/run/inspect-build

rm -r ./temp/tsc
