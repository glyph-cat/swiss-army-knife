set -e

# Loop through each subpackage and do `yarn build`
for item in ./packages/*; do
  if [ -d "$item" ]; then
    if [[ $item =~ "playground" ]]; then
      continue; # Temporary
    fi
    yarn --cwd $item lint
  fi
done
