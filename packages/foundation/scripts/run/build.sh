set -e

rush-pnpm run clean
rush-pnpm run bundle
rush-pnpm run types
rush-pnpm run api

rm -r ./temp/tsc
