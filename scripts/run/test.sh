set -e

# Loop through each subpackage and do `yarn build`
for item in ./packages/*; do
  if [ -d "$item" ]; then
    yarn --cwd $item test
  fi
done
