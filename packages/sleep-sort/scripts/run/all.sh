set -e

rushx lint
rushx spellcheck
rushx test # since we are testing the source code, not the compiled one
rushx build
pnpm pack
