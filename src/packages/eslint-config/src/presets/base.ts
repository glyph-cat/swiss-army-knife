import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import { Config, defineConfig } from 'eslint/config'
import ts from 'typescript-eslint'
import { objectReduce } from '../../../core/src/data/object/reduce'
import { Severity } from '../abstractions/public'
import { COMMON_FILE_EXTENSIONS } from '../constants/internal'
import { formatName } from '../utils/format-name'

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

  // Converts all 'error' severity to 'warn'
  const stylisticConfigsRecommendedWarn: typeof stylistic.configs.recommended = {
    ...stylistic.configs.recommended,
    rules: objectReduce(stylistic.configs.recommended.rules, (acc, ruleValue, ruleName) => {
      if (ruleValue === 'error' || ruleValue === Severity.ERROR) {
        acc[ruleName] = remapWarn
      } else if (
        Array.isArray(ruleValue) &&
        (ruleValue[0] === 'error' || ruleValue[0] === Severity.ERROR)
      ) {
        acc[ruleName] = [Severity.WARN, ...ruleValue.slice(1)]
      } else {
        acc[ruleName] = ruleValue
      }
      return acc
    }, {} as typeof stylistic.configs.recommended.rules),
  }

  return defineConfig(
    js.configs.recommended,
    ts.configs.recommended,
    importPlugin.flatConfigs.recommended,
    stylisticConfigsRecommendedWarn,
    {
      name: formatName('base'),
      rules: {

        // #region Code health

        '@typescript-eslint/no-shadow': remapError,
        'eqeqeq': [remapError, 'always'],
        'no-dupe-keys': remapError,
        'no-duplicate-imports': remapError,
        'no-shadow': OFF, // See '@typescript-eslint/no-shadow'

        // temp
        // 'import/no-unresolved': OFF,
        'import/no-unresolved': [remapError, {
          ignore: [
            '^!!raw-loader!',
            'csstype',
          ],
        }],

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
        'import/export': OFF,
        'no-async-promise-executor': remapWarn,
        'no-console': remapWarn,
        'no-constant-condition': remapWarn,
        'no-unreachable': remapWarn,
        'prefer-const': remapWarn,
        'prefer-spread': remapWarn,

        // #endregion Code optimization

        // #region Styling

        '@stylistic/arrow-parens': [remapWarn, 'always'],
        '@stylistic/brace-style': [remapWarn, '1tbs', {
          allowSingleLine: true,
        }],
        '@stylistic/comma-dangle': [remapWarn, 'only-multiline'],
        '@stylistic/eol-last': [remapWarn, 'always'],
        '@stylistic/indent': [remapWarn, 2, { SwitchCase: 1 }],
        '@stylistic/key-spacing': remapWarn,
        '@stylistic/lines-between-class-members': [remapWarn, 'always', {
          exceptAfterSingleLine: true,
        }],
        '@stylistic/max-statements-per-line': OFF,
        '@stylistic/member-delimiter-style': remapWarn,
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
        '@stylistic/space-in-parens': remapWarn,
        '@stylistic/space-infix-ops': remapWarn,
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

        '@typescript-eslint/ban-ts-comment': remapWarn,
        'import/no-anonymous-default-export': OFF,
        'import/no-named-as-default': OFF,
        'no-restricted-imports': [remapError, {
          paths: [
            {
              name: 'jest',
              importNames: [
                'it',
              ],
              message: 'Please use `test` instead',
            },
            // TODO: Find out, if we split this in flat config, will it override prev spec?
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

        // #region No longer effective

        // '@typescript-eslint/ban-types': remapWarn,
        // 'import/no-unused-modules': [remapWarn, { unusedExports: true }],

        // #endregion No longer effective

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
      name: formatName('ts-only'),
      files: [
        '**/*.ts',
        '**/*.tsx',
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': Severity.WARN,
        '@typescript-eslint/no-var-requires': Severity.WARN,
      },
    },
    {
      // Potentially useful reference:
      // https://github.com/valor-software/eslint-config-valorsoft#how-to-use
      name: formatName('ignore list'),
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

}
