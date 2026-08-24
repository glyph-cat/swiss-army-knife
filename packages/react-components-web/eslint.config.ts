import { recommended as baseRecommended } from '@glyph-cat/eslint-config/base'
import { recommended as jestRecommended } from '@glyph-cat/eslint-config/jest'
import {
  BuildRule,
  EXHAUSTIVE_DEPS_DEFAULT_ADDITIONAL_HOOKS,
  recommended as reactRecommended,
} from '@glyph-cat/eslint-config/react'
import { Severity } from '@glyph-cat/eslint-config/src'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig(
  baseRecommended,
  reactRecommended,
  jestRecommended,
  {
    rules: {
      'no-console': Severity.OFF, // temp
      '@typescript-eslint/no-namespace': Severity.OFF,
      '@typescript-eslint/no-require-imports': Severity.OFF,
      '@typescript-eslint/no-empty-object-type': Severity.WARN, // temp
      ...BuildRule.ReactHooks.ExhaustiveDeps(Severity.WARN, [
        ...EXHAUSTIVE_DEPS_DEFAULT_ADDITIONAL_HOOKS,
        // 'useLayeredFocusEffect',
        // 'useKeyChordActivationListener',
        // 'useKeyDownListener',
        // 'useKeyUpListener',
      ]),
      'react/forbid-elements': [Severity.ERROR, {
        forbid: [
          {
            element: 'div',
            message: 'Use <View> from \'@glyph-cat/swiss-army-knife-react\' instead whenever possible',
          },
          // {
          //   element: 'input',
          //   message: 'Use <Input> from \'@glyph-cat/swiss-army-knife-react\' instead whenever possible',
          // },
          // {
          //   element: 'textarea',
          //   message: 'Use <TextArea> from \'@glyph-cat/swiss-army-knife-react\' instead whenever possible',
          // },
        ],
      }],
    },
  },
  {
    settings: {
      'import/resolver': {
        typescript: true,
      },
      react: {
        version: '19',
      },
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
