import { recommended as baseRecommended } from '@glyph-cat/eslint-config/base'
import { recommended as jestRecommended } from '@glyph-cat/eslint-config/jest'
import { Severity } from '@glyph-cat/eslint-config/src'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig(
  baseRecommended,
  jestRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'no-console': Severity.OFF, // temp
      '@typescript-eslint/no-namespace': Severity.OFF,
      '@typescript-eslint/no-require-imports': Severity.OFF,
      '@typescript-eslint/no-empty-object-type': Severity.WARN, // temp
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      './babel.config.js',
      './config/rollup.config.js',
    ],
  },
)
