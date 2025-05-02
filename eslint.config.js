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
      'no-console': Severity.OFF, // temp
      '@typescript-eslint/no-namespace': Severity.OFF,
      '@typescript-eslint/no-require-imports': Severity.OFF,
      'no-restricted-imports': [Severity.ERROR, {
        paths: [
          {
            name: 'react',
            importNames: [
              'RefObject',
            ],
            message: 'Please import from \'@glyph-cat/swiss-army-knife\' instead.',
          },
        ],
      }],
      '@typescript-eslint/no-empty-object-type': Severity.WARN, // temp
      ...BuildRule.ReactHooks.ExhaustiveDeps(Severity.WARN, [
        ...EXHAUSTIVE_DEPS_DEFAULT_ADDITIONAL_HOOKS,
        // 'useLayeredFocusEffect',
        // 'useKeyChordActivationListener',
        // 'useKeyDownListener',
        // 'useKeyUpListener',
      ]),
      'import/no-unresolved': [Severity.ERROR, {
        ignore: [
          '^!!raw-loader!',
        ],
      }],
      'react/forbid-elements': [Severity.ERROR, {
        forbid: [
          {
            element: 'div',
            message: 'Use <View> from \'@glyph-cat/swiss-army-knife-react\' instead whenever possible',
          },
          {
            element: 'input',
            message: 'Use <Input> from \'@glyph-cat/swiss-army-knife-react\' instead whenever possible',
          },
          {
            element: 'textarea',
            message: 'Use <TextArea> from \'@glyph-cat/swiss-army-knife-react\' instead whenever possible',
          },
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
]
