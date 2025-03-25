# Contributing

## Dependency Management
1. Run `yarn install` in the monorepo's root directory to fetch all relevant dependencies.
2. Run `yarn setup` in the monorepo's root directory to create symbolic links for `node_modules` in every package.
3. Do not manage dependencies (Eg: `yarn install`, `yarn add`, `yarn remove`) inside the directories of individual packages as they share the same one from the root directory.
