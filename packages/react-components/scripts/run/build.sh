set -e

rushx clean
rushx bundle
rushx types
rushx api

rush-pnpm exec tsx ./scripts/run/inspect-build

rm -r ./temp/tsc
