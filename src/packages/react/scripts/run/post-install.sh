# Copy important files from 'core' to 'react' package to mimic `yarn install`
# as it might be removed by yarn after running `yarn install` since it is not
# specified in package.json

if [ -d ../core/lib ]; then
  mkdir -p ./node_modules/@glyph-cat/swiss-army-knife
  cp -rf ../core/lib ./node_modules/@glyph-cat/swiss-army-knife
  cp ../core/package.json ./node_modules/@glyph-cat/swiss-army-knife
  cp ../core/yarn.lock ./node_modules/@glyph-cat/swiss-army-knife
fi
