const { Severity } = require('@glyph-cat/eslint-config')
const { libraryAuthoring: baseLibraryAuthoring } = require('@glyph-cat/eslint-config/base')
const { libraryAuthoring: reactLibraryAuthoring } = require('@glyph-cat/eslint-config/react')
const { recommended: jestRecommended } = require('@glyph-cat/eslint-config/jest')

module.exports = [
  ...baseLibraryAuthoring,
  ...reactLibraryAuthoring,
  ...jestRecommended,
  {
    rules: {
      '@typescript-eslint/no-namespace': Severity.OFF,
      '@typescript-eslint/no-require-imports': Severity.OFF,
    },
  },
  {
    ignores: [
      // 'eslint.config.js',
      'config/rollup.config.js',
      '*.draft*',
      '*.old*',
      '*.scripted*',
      'dist',
      'lib',
      'node_modules',
      'temp/',
    ],
  },
]
