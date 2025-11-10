import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import { Config, defineConfig } from 'eslint/config'
import globals from 'globals'
import ts from 'typescript-eslint'
import { Severity } from '../abstractions/public'
import { COMMON_FILE_EXTENSIONS } from '../constants/internal'
// import { fixupPluginRules } from '@eslint/compat'
// import typescriptPlugin from '@typescript-eslint/eslint-plugin'
// import tsParser from '@typescript-eslint/parser'

const OFF = Severity.OFF

export interface BaseConfigParams {
  remapOff: Severity
  remapWarn: Severity
  remapError: Severity
}

export function createBaseConfig({
  remapWarn,
  remapError,
}: BaseConfigParams): Array<Config> {
  return defineConfig(
    js.configs.recommended,
    ts.configs.recommended,
    importPlugin.flatConfigs.recommended,
    // importPlugin.flatConfigs.react,
    // importPlugin.flatConfigs['react-native'],
    // importPlugin.flatConfigs.typescript,
    // importPlugin.flatConfigs.electron,
    stylistic.configs.recommended,
    {
      rules: {

        // #region Code health

        '@typescript-eslint/no-shadow': remapError,
        'eqeqeq': [remapError, 'always'],
        'no-dupe-keys': remapError,
        'no-duplicate-imports': remapError,
        'no-shadow': OFF, // See '@typescript-eslint/no-shadow'

        // temp
        'import/no-unresolved': OFF,
        // 'import/no-unresolved': [remapError, {
        //   ignore: [
        //     '^!!raw-loader!',
        //     'csstype',
        //   ],
        // }],

        'import/no-cycle': remapError,
        'import/no-deprecated': OFF, // remapError,

        // #endregion Code health

        // #region Code optimization

        '@typescript-eslint/no-empty-function': remapWarn,
        '@typescript-eslint/no-empty-interface': remapWarn,
        '@typescript-eslint/no-explicit-any': [remapWarn, {
          ignoreRestArgs: true,
        }],
        '@typescript-eslint/no-unused-vars': [remapWarn, {
          ignoreRestSiblings: true,
        }],
        'no-constant-condition': remapWarn,
        'no-unreachable': remapWarn,
        'prefer-const': remapWarn,
        'prefer-spread': remapWarn,
        'import/export': OFF,

        // #endregion Code optimization

        // #region Styling

        '@stylistic/arrow-parens': [remapWarn, 'always'],
        '@stylistic/brace-style': [remapWarn, '1tbs', {
          allowSingleLine: true,
        }],
        '@stylistic/comma-dangle': [remapWarn, 'only-multiline'],
        '@stylistic/eol-last': [remapWarn, 'always'],
        '@stylistic/indent': [remapWarn, 2, { SwitchCase: 1 }],
        '@stylistic/lines-between-class-members': [remapWarn, 'always', {
          exceptAfterSingleLine: true,
        }],
        '@stylistic/max-statements-per-line': OFF,
        '@stylistic/multiline-ternary': OFF,
        '@stylistic/no-extra-semi': remapWarn,
        '@stylistic/no-mixed-operators': remapWarn,
        '@stylistic/no-multi-spaces': OFF,
        '@stylistic/no-multiple-empty-lines': remapWarn,
        '@stylistic/no-trailing-spaces': remapWarn,
        '@stylistic/object-property-newline': [remapWarn, {
          allowAllPropertiesOnSameLine: true,
        }],
        '@stylistic/operator-linebreak': [remapWarn, 'after', {
          overrides: {
            '?': 'before',
            ':': 'before',
          },
        }],
        '@stylistic/padded-blocks': [
          remapWarn,
          {
            classes: 'always',
            switches: 'never',
          },
          { allowSingleLineBlocks: true },
        ],
        '@stylistic/quotes': [remapWarn, 'single'],
        '@stylistic/quote-props': OFF,
        '@stylistic/semi': [remapWarn, 'never'],
        '@stylistic/spaced-comment': remapWarn,
        'import/newline-after-import': remapWarn,
        'no-empty': remapWarn,
        'no-irregular-whitespace': [remapWarn, {
          skipStrings: true,
          skipComments: true,
          skipRegExps: true,
          skipTemplates: true,
        }],
        'yoda': [remapWarn, 'never'],

        // #endregion Styling

        // #region Miscellaneous

        'import/no-anonymous-default-export': OFF,
        'no-restricted-imports': [remapError, {
          paths: [
            {
              name: 'jest',
              importNames: [
                'it',
              ],
              message: 'Please use `test` instead',
            },
            {
              name: 'react',
              importNames: [
                'RefObject',
              ],
              message: 'Please import from \'@glyph-cat/swiss-army-knife\' instead.',
            },
          ],
        }],
        'no-warning-comments': [Severity.WARN, {
          // NOTE: Special rule that should remain as warning only: `remapWarn` not used.
          terms: [
            'TEMP',
            'TODO',
            'TOFIX',
            'KIV',
          ],
        }],

        // #endregion Miscellaneous

      },
      settings: {
        'import/extensions': COMMON_FILE_EXTENSIONS,
        'import/resolver': {
          // For most cases, this will suffice
          // In rare cases, we need to use `ALT_IMPORT_RESOLVER_SETTINGS` instead
          typescript: {}, // './tsconfig.json',
        },
      },
      // languageOptions: {
      //   globals: {
      //     ...globals.browser,
      //     ...globals.commonjs,
      //     ...globals.es2020,
      //     ...globals.jest,
      //     ...globals.node,
      //   },
      //   // ecmaVersion: 11,
      //   // sourceType: 'module',
      //   // parserOptions: {
      //   //   ecmaVersion: 11,
      //   //   ecmaFeatures: {
      //   //     jsx: true,
      //   //   },
      //   //   sourceType: 'module',
      //   // },
      //   // parser: tsParser,
      // },
    },
    {
      // Potentially useful reference:
      // https://github.com/valor-software/eslint-config-valorsoft#how-to-use
      // name: '@glyph-cat/eslint-config (ignore list)',
      ignores: [
        '**/*.draft*',
        '**/*.scripted*',
        '**/*.secret*',
        '**/*.old*',
        '**/dist/',
        '**/lib/', // TOFIX: not working
        '**/temp/',
        '**/build/',
        '.next/',
      ],
    },
  )
  // return [
  //   {
  //     name: '@glyph-cat/eslint-config (base)',
  //     languageOptions: {
  //       globals: {
  //         ...globals.browser,
  //         ...globals.commonjs,
  //         ...globals.es2020,
  //         ...globals.jest,
  //         ...globals.node,
  //       },
  //       // ecmaVersion: 11,
  //       // sourceType: 'module',
  //       parserOptions: {
  //         ecmaVersion: 11,
  //         ecmaFeatures: {
  //           jsx: true,
  //         },
  //         sourceType: 'module',
  //       },
  //       parser: tsParser,
  //     },
  //     plugins: {
  //       '@stylistic': stylistic,
  //       // ========== TOFIX ==========
  //       // '@typescript-eslint': typescriptPlugin,
  //       'import': fixupPluginRules(importPlugin),
  //       // Ref: https://eslint.org/blog/2024/05/eslint-compatibility-utilities
  //     },
  //     rules: {

  //       // #region Category A: Code Health

  //       // Problems that fall under this category may produce nasty bugs.
  //       '@typescript-eslint/explicit-module-boundary-types': OFF, // We don't want this for JS files
  //       // TOFIX: Parse errors in imported module '{package-name}': parserPath or languageOptions.parser is required! (undefined:undefined)

  //       // #endregion Category A: Code Health

  //       // #region Category B: Bad practices

  //       // Problems that fall under this category are unlikely to produce bugs on
  //       // their own, but will make writing code that produce bugs easier.
  //       '@typescript-eslint/ban-ts-comment': remapWarn,
  //       // '@typescript-eslint/ban-types': remapWarn,
  //       '@typescript-eslint/no-var-requires': OFF, // We don't want this for JS files
  //       // 'import/no-unused-modules': [remapWarn, { unusedExports: true }],
  //       // Some dynamically imported or required files are not recognized as being
  //       // use and will trigger false positive
  //       'no-async-promise-executor': remapWarn,
  //       'no-console': remapWarn,
  //       // #endregion Category B: Bad practices
  //     },
  //   },
  //   {
  //     name: '@glyph-cat/eslint-config (ts-only)',
  //     files: [
  //       '**/*.ts',
  //       '**/*.tsx',
  //     ],
  //     // ========== TOFIX ==========
  //     // plugins: {
  //     //   '@typescript-eslint': typescriptPlugin,
  //     // },
  //     rules: {
  //       '@typescript-eslint/explicit-module-boundary-types': Severity.WARN,
  //       '@typescript-eslint/no-var-requires': Severity.WARN,
  //     },
  //   },
  // ]
}
