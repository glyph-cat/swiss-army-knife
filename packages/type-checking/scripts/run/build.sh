set -e

pnpm clean
pnpm bundle
pnpm types
pnpm api

rm -r ./temp/tsc
