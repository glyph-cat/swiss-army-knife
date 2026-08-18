set -e

rushx afe
rushx lint
rushx spellcheck
rushx test # since we are testing the source code, not the compiled one
rushx build
rush-pnpm pack
