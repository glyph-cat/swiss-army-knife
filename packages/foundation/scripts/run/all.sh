set -e

rushx afe
rushx lint
rushx build
rushx test
rush-pnpm pack
