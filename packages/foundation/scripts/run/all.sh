set -e

rushx afe
rushx lint
rushx spellcheck
rushx build
rushx test
rush-pnpm pack
