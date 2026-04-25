set -e

pnpm run lint
pnpm run test # since we are testing the source code, not the compiled one
pnpm run build
pnpm pack
