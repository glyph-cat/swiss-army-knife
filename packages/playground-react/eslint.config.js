const { Severity } = require('@glyph-cat/eslint-config')
const { recommended: baseRecommended } = require('@glyph-cat/eslint-config/base')
const {
  BuildRule,
  EXHAUSTIVE_DEPS_DEFAULT_ADDITIONAL_HOOKS,
  recommended: reactRecommended,
} = require('@glyph-cat/eslint-config/react')

module.exports = [
  ...baseRecommended,
  ...reactRecommended,
  {
    rules: {
      'no-console': Severity.OFF,
      '@typescript-eslint/no-require-imports': Severity.OFF,
      'no-restricted-imports': [Severity.ERROR, {
        paths: [
          {
            name: 'cookies',
            message: 'Please use `CookieRecord` instead.',
          },
        ],
      }],
      '@typescript-eslint/no-empty-object-type': Severity.WARN, // temp
      ...BuildRule.ReactHooks.ExhaustiveDeps(Severity.WARN, [
        ...EXHAUSTIVE_DEPS_DEFAULT_ADDITIONAL_HOOKS,
        'useLayeredFocusEffect',
        'useKeyChordActivationListener',
        'useKeyDownListener',
        'useKeyUpListener',
      ]),
      'react/forbid-elements': [Severity.ERROR, {
        forbid: [
          {
            element: 'div',
            message: 'Use <View> from \'~core-ui\' instead whenever possible',
          },
          {
            element: 'input',
            message: 'Use <Input> from \'~core-ui\' instead whenever possible',
          },
          {
            element: 'textarea',
            message: 'Use <TextArea> from \'~core-ui\' instead whenever possible',
          },
        ],
      }],
    },
  },
  {
    ignores: [
      'public/',
    ],
  },
]
