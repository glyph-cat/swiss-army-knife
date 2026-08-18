set -e

rush-pnpm run afe
rush-pnpm run lint
rush-pnpm run build
rush-pnpm pack
