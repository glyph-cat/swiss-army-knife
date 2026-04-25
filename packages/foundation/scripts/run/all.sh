set -e

pnpm run afe
pnpm run lint
pnpm run build
pnpm pack
