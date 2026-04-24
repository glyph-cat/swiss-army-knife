set -e

# pnpm --dir run ../../.. check-deps

pnpm run clean
pnpm run bundle
pnpm run types
pnpm run api

rm -r ./temp/tsc
