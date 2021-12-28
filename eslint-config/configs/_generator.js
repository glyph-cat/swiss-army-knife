const chalk = require('chalk')

const emphasize = chalk.bold.underline.cyan

const PERMANENT_OFF = 0
const PERMANENT_WARN = 1

const sharedExtensions = ['.js', '.jsx', '.ts', '.tsx']

const createConfig = ({
  off: OFF,
  warn: WARN,
  error: ERROR,
}) => {
  return {
    env: {
      browser: true,
      commonjs: true,
      es2020: true,
      jest: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      // 'plugin:jsx-a11y/recommended', // eslint-plugin-jsx-a11y
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 11,
      ecmaFeatures: {
        jsx: true,
      },
      sourceType: 'module',
    },
    plugins: [
      'eslint-plugin-import',
    ],
    rules: {

      // NOTE: Some of the rules below are turned off because they trigger
      // false positives in JavaScript files. They are re-enabled exclusively
      // for TypeScript in the `overrides` section.

      // === Category A: Code Health ===
      // Problems that fall under this category may produce nasty bugs.
      '@typescript-eslint/explicit-module-boundary-types': PERMANENT_OFF, // See `overrides`
      '@typescript-eslint/no-shadow': ERROR,
      'eqeqeq': [ERROR, 'always'],
      'import/no-cycle': ERROR,
      'import/no-deprecated': ERROR,
      'import/no-unresolved': [ERROR, {
        ignore: [
          'csstype',
        ],
      }],
      'no-dupe-keys': ERROR,
      'no-duplicate-imports': ERROR,
      'no-shadow': PERMANENT_OFF, // See '@typescript-eslint/no-shadow'

      // === Category B: Bad practices ===
      // Problems that fall under this category are unlikely to produce bugs on
      // their own, but will make writing code that produce bugs easier.
      '@typescript-eslint/ban-ts-comment': WARN,
      '@typescript-eslint/ban-types': WARN,
      '@typescript-eslint/no-empty-function': WARN,
      '@typescript-eslint/no-empty-interface': WARN,
      '@typescript-eslint/no-explicit-any': [WARN, {
        ignoreRestArgs: true,
      }],
      '@typescript-eslint/no-unused-vars': [WARN, {
        ignoreRestSiblings: true,
      }],
      '@typescript-eslint/no-var-requires': PERMANENT_OFF, // See `overrides`
      // 'import/no-unused-modules': [WARN, { unusedExports: true }],
      // Some dynamically imported or required files are not recognized as being
      // use and will trigger false positive
      'prefer-const': WARN,
      'prefer-spread': WARN,
      'no-async-promise-executor': WARN,
      'no-console': WARN,
      'no-constant-condition': WARN,
      'no-restricted-imports': [ERROR, {
        paths: [{
          name: 'jest',
          importNames: ['it'],
          message: 'Please import `test` instead',
        }, {
          name: 'react',
          importNames: ['useRef', 'useLayoutEffect'],
          message: 'Please import from ' + emphasize('\'@glyph-cat/swiss-army-knife\'') +
            ' instead.',
        }]
      }],
      'no-unreachable': WARN,

      // === Category C: Code Styles ===
      // Problems that fall under this category will at most make the codebase
      // look inconsistent and hard to read.
      '@typescript-eslint/no-extra-semi': WARN,
      'eol-last': [WARN, 'always'],
      'import/newline-after-import': WARN,
      indent: [WARN, 2, { SwitchCase: 1 }],
      'lines-between-class-members': [WARN, 'always', {
        exceptAfterSingleLine: true,
      }],
      'no-irregular-whitespace': [WARN, {
        skipStrings: true,
        skipComments: true,
        skipRegExps: true,
        skipTemplates: true,
      }],
      'no-trailing-spaces': WARN,
      'object-property-newline': [WARN, {
        allowAllPropertiesOnSameLine: true,
      }],
      'operator-linebreak': [WARN, 'after', {
        overrides: {
          '?': 'before',
          ':': 'before',
        },
      }],
      'padded-blocks': [
        WARN,
        {
          classes: 'always',
          switches: 'never',
        },
        { allowSingleLineBlocks: true },
      ],
      'quotes': [WARN, 'single'],
      'semi': [WARN, 'never'],
      // KIV: Not flexible enough. Need a rule that can take relativity into
      // account when sorting as well.
      // relativity
      // 'sort-imports': [WARN, {
      //   ignoreCase: true,
      //   memberSyntaxSortOrder: [
      //     'none',
      //     'all',
      //     'single',
      //     'multiple',
      //   ],
      // }],
      'yoda': [WARN, 'never'],

      // === Category D: Framework specific ===
      // 'react/jsx-no-undef': OFF, // KIV: Might want to leave this on
      'react/display-name': OFF,
      'react/jsx-no-bind': WARN,
      // Only need properties in React's `style` prop to be sorted
      // 'react/jsx-sort-props': [WARN, {
      //   ignoreCase: true,
      // }],
      'react/no-children-prop': ERROR,
      'react/prop-types': OFF,
      'react/react-in-jsx-scope': OFF, // React ≥17 has new JSX transform

      // === Category E: Special ===
      /**
       * Can be disregarded.
       */
      'import/no-anonymous-default-export': PERMANENT_OFF,
      /**
       * Code that requires attention (should always remain as warning only).
       */
      'no-warning-comments': [PERMANENT_WARN, {
        terms: [
          'TODO',
          'TOFIX',
          'KIV',
        ],
      }],

    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        rules: {
          '@typescript-eslint/explicit-module-boundary-types': WARN,
          '@typescript-eslint/no-var-requires': WARN,
        },
      },
    ],
    settings: {
      'import/extensions': sharedExtensions,
      'import/resolver': {
        // KIV:
        // 1. For most cases, this will suffice:
        typescript: {},
        // 2. In rare cases, we need to remove `typescript: {}` and add the
        // config below for ESLint to work:
        // node: {
        //   extensions: sharedExtensions,
        // },
      },
      // See: https://github.com/benmosher/eslint-plugin-import/issues/1485#issuecomment-571597574

      'react': {
        pragma: 'React',
        fragment: 'Fragment',
        version: 'detect',
      },
    },
  }
}

module.exports = { createConfig }
