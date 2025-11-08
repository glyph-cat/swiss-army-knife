## Requirements

### Mandatory
* `eslint` — `>=9`
* `globals` — `>=14`

### Optional
* `eslint-plugin-react` — `7.34.2`
* `eslint-plugin-react-hooks` — `4.6.2`
* `eslint-plugin-jest` — `28.6.0`

## Installation

### Standard
```sh
yarn add -D @glyph-cat/eslint-config
```

### Jest
```sh
yarn add -D @glyph-cat/eslint-config eslint-plugin-jest
```

### React
```sh
yarn add -D @glyph-cat/eslint-config eslint-plugin-react eslint-plugin-react-hooks
```

### Everything (for easy of copy)
```sh
yarn add -D @glyph-cat/eslint-config eslint-plugin-jest eslint-plugin-react eslint-plugin-react-hooks
```

## Usage

### Normal

```js
const { recommended as baseRecommended } = require('@glyph-cat/eslint-config/base')
const { recommended as jestRecommended } = require('@glyph-cat/eslint-config/jest')
const { recommended as reactRecommended } = require('@glyph-cat/eslint-config/react')

module.exports = [
  ...baseRecommended,
  ...jestRecommended, // optional, for projects that uses Jest
  ...reactRecommended, // optional, for React projects
]

```

### Library Authoring

```js
const { libraryAuthoring as baseLibraryAuthoring } = require('@glyph-cat/eslint-config/base')
const { libraryAuthoring as jestLibraryAuthoring } = require('@glyph-cat/eslint-config/jest')
const { libraryAuthoring as reactLibraryAuthoring } = require('@glyph-cat/eslint-config/react')

module.exports = [
  ...baseLibraryAuthoring,
  ...jestLibraryAuthoring, // optional, but libraries should be adequately tested to begin with
  ...reactLibraryAuthoring, // optional, for React-based libraries
]

```

## Troubleshooting

### Key "globals": Global "AudioWorkletGlobalScope " has leading or trailing whitespace.

Solution: Run `yarn why globals` to check the version. Make sure the version of [globals](https://www.npmjs.com/package/globals) is at least v14.X.X. The package can be updated to the latest version by running `yarn upgrade global@latest`.

### context.getAncestors is not a function ... Rule: "react/jsx-no-bind"

The `eslint-plugin-react` installed might be an old version, run `yarn upgrade eslint-plugin-react@latest` and the problem should be resolved. Working version of `eslint-plugin-react` is `7.34.2` at the time of writing.

### context.getSource is not a function ... Rule: "react-hooks/rules-of-hooks"

For the time being, install the `rc` version by running `yarn upgrade eslint-plugin-react@rc` to resolve the problem. (written as of 09 June 2024)
