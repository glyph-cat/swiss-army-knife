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
  baseRecommended.map((config) => {
    if (config.name !== '@glyph-cat/eslint-config (base)') {
      return config // Early exit
    }
    const NO_RESTRICTED_IMPORTS = 'no-restricted-imports'
    return {
      ...config,
      rules: {
        ...config.rules,
        [NO_RESTRICTED_IMPORTS]: [(config.rules![NO_RESTRICTED_IMPORTS] as any)[0], {
          ...(config.rules![NO_RESTRICTED_IMPORTS] as any)[1],
          paths: [
            ...(config.rules![NO_RESTRICTED_IMPORTS] as any)[1].paths,
            {
              name: '@glyph-cat/react-test-utils',
              importNames: [
                'useTestProbe',
              ],
              message: 'Please import from `_internals` instead',
            },
          ],
        }],
      },
    }
  }),
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
