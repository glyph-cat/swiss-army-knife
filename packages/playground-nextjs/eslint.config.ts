// @ts-nocheck
import { defineConfig } from 'eslint/config'
import { Severity } from './src/packages/eslint-config/src'
import {
  recommended as baseRecommended,
} from './src/packages/eslint-config/src/bundle-entry-point/base'
import {
  recommended as jestRecommended,
} from './src/packages/eslint-config/src/bundle-entry-point/jest'
import {
  BuildRule,
  EXHAUSTIVE_DEPS_DEFAULT_ADDITIONAL_HOOKS,
  recommended as reactRecommended,
} from './src/packages/eslint-config/src/bundle-entry-point/react'

// const { Severity } = require('./src/packages/eslint-config/src')
// const {
//   recommended: baseRecommended,
// } = require('./src/packages/eslint-config/src/bundle-entry-point/base')
// const {
//   BuildRule,
//   EXHAUSTIVE_DEPS_DEFAULT_ADDITIONAL_HOOKS,
//   recommended: reactRecommended,
// } = require('./src/packages/eslint-config/src/bundle-entry-point/react')
// const {
//   recommended: jestRecommended,
// } = require('./src/packages/eslint-config/src/bundle-entry-point/jest')

module.exports = defineConfig(
  baseRecommended.map((config) => {
    if (config.name !== '@glyph-cat/eslint-config (base)') {
      return config // Early exit
    }
    const NO_RESTRICTED_IMPORTS = 'no-restricted-imports'
    return {
      ...config,
      rules: {
        ...config.rules,
        [NO_RESTRICTED_IMPORTS]: [config.rules[NO_RESTRICTED_IMPORTS][0], {
          ...config.rules[NO_RESTRICTED_IMPORTS][1],
          paths: [
            ...config.rules[NO_RESTRICTED_IMPORTS][1].paths,
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
      'import/no-unresolved': Severity.OFF, // temp
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
      'react/no-unknown-property': [Severity.ERROR, {
        ignore: [
          'angle',
          'decay',
          'intensity',
          'penumbra',
          'position',
          'rotation',
        ],
      }],
    },
  },
  {
    ignores: [
      'public/',
    ],
  },
)
