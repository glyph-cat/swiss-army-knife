set -e

pnpm afe
pnpm lint
pnpm test # since we are testing the source code, not the compiled one
pnpm build
pnpm pack
