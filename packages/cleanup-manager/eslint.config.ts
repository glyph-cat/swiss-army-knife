import { recommended as baseRecommended } from '@glyph-cat/eslint-config/base'
import { recommended as jestRecommended } from '@glyph-cat/eslint-config/jest'
import { Severity } from '@glyph-cat/eslint-config/src'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  baseRecommended,
  jestRecommended,
  {
    rules: {
      'no-console': Severity.OFF, // temp
      '@typescript-eslint/no-namespace': Severity.OFF,
      '@typescript-eslint/no-require-imports': Severity.OFF,
      '@typescript-eslint/no-empty-object-type': Severity.WARN, // temp
    },
  },
)
