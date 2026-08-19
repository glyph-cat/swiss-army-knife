set -e

# Cleanup old artifacts
rm -rf ./temp/tsc ./lib ./base/lib ./jest/lib ./react/lib

# Generate bundle
rollup -c ./config/rollup.config.js

# Generate type definitions
tsc -p ./tsconfig.build.json --declaration --declarationDir ./temp/tsc/types --emitDeclarationOnly
api-extractor run -c ./config/api-extractor.json --local --verbose
api-extractor run -c ./config/api-extractor.base.json --local --verbose
api-extractor run -c ./config/api-extractor.jest.json --local --verbose
api-extractor run -c ./config/api-extractor.react.json --local --verbose
