import { fixupPluginRules } from '@eslint/compat'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import tsEslint from 'typescript-eslint'
import { Severity } from '../abstractions/public'
import { COMMON_FILE_EXTENSIONS } from '../constants/internal'

export interface BaseConfigParams {
  remapOff: Severity
  remapWarn: Severity
  remapError: Severity
}

export function createBaseConfig({
  remapWarn,
  remapError,
}: BaseConfigParams): Array<Linter.Config> {
  return [
    {
      name: '@eslint/js',
      ...js.configs.recommended,
    },
    // ========== TOFIX ==========
    // ...tsEslint.configs.recommended,
    {
      name: '@glyph-cat/eslint-config (base)',
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.commonjs,
          ...globals.es2020,
          ...globals.jest,
          ...globals.node,
        },
        // ecmaVersion: 11,
        // sourceType: 'module',
        parserOptions: {
          ecmaVersion: 11,
          ecmaFeatures: {
            jsx: true,
          },
          sourceType: 'module',
        },
        parser: tsParser,
      },
      plugins: {
        '@stylistic': stylistic,
        // ========== TOFIX ==========
        // '@typescript-eslint': typescriptPlugin,
        'import': fixupPluginRules(importPlugin),
        // Ref: https://eslint.org/blog/2024/05/eslint-compatibility-utilities
      },
      rules: {

        // #region Category A: Code Health

        // Problems that fall under this category may produce nasty bugs.
        '@typescript-eslint/explicit-module-boundary-types': Severity.OFF, // We don't want this for JS files
        '@typescript-eslint/no-shadow': remapError,
        'eqeqeq': [remapError, 'always'],
        'import/no-cycle': remapError,

        'import/no-deprecated': Severity.OFF, // remapError,
        // TOFIX: Parse errors in imported module '{package-name}': parserPath or languageOptions.parser is required! (undefined:undefined)

        'import/no-unresolved': [remapError, {
          ignore: [
            'csstype',
          ],
        }],
        'no-dupe-keys': remapError,
        'no-duplicate-imports': remapError,
        'no-shadow': Severity.OFF, // See '@typescript-eslint/no-shadow'

        // #endregion Category A: Code Health

        // #region Category B: Bad practices

        // Problems that fall under this category are unlikely to produce bugs on
        // their own, but will make writing code that produce bugs easier.
        '@typescript-eslint/ban-ts-comment': remapWarn,
        // '@typescript-eslint/ban-types': remapWarn,
        '@typescript-eslint/no-empty-function': remapWarn,
        '@typescript-eslint/no-empty-interface': remapWarn,
        '@typescript-eslint/no-explicit-any': [remapWarn, {
          ignoreRestArgs: true,
        }],
        '@typescript-eslint/no-unused-vars': [remapWarn, {
          ignoreRestSiblings: true,
        }],
        '@typescript-eslint/no-var-requires': Severity.OFF, // We don't want this for JS files
        // 'import/no-unused-modules': [remapWarn, { unusedExports: true }],
        // Some dynamically imported or required files are not recognized as being
        // use and will trigger false positive
        'prefer-const': remapWarn,
        'prefer-spread': remapWarn,
        'no-async-promise-executor': remapWarn,
        'no-console': remapWarn,
        'no-constant-condition': remapWarn,
        'no-restricted-imports': [remapError, {
          paths: [{
            name: 'jest',
            importNames: ['it'],
            message: 'Please import `test` instead',
          }],
        }],
        'no-unreachable': remapWarn,

        // #endregion Category B: Bad practices

        // #region Category C: Code Styles
        // Problems that fall under this category will at most make the codebase
        // look inconsistent and hard to read.
        '@stylistic/eol-last': [remapWarn, 'always'],
        '@stylistic/no-extra-semi': remapWarn,
        // 'import/newline-after-import': remapWarn,
        '@stylistic/indent': [remapWarn, 2, { SwitchCase: 1 }],
        '@stylistic/lines-between-class-members': [remapWarn, 'always', {
          exceptAfterSingleLine: true,
        }],
        'no-irregular-whitespace': [remapWarn, {
          skipStrings: true,
          skipComments: true,
          skipRegExps: true,
          skipTemplates: true,
        }],
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
        '@stylistic/semi': [remapWarn, 'never'],
        // KIV: Not flexible enough. Need a rule that can take relativity into
        // account when sorting as well.
        // relativity
        // 'sort-imports': [remapWarn, {
        //   ignoreCase: true,
        //   memberSyntaxSortOrder: [
        //     'none',
        //     'all',
        //     'single',
        //     'multiple',
        //   ],
        // }],
        'yoda': [remapWarn, 'never'],

        // #endregion Category C: Code Styles

        // #region Miscellaneous

        /**
         * Can be disregarded.
         */
        'import/no-anonymous-default-export': Severity.OFF,
        /**
         * Code that requires attention (should always remain as warning only).
         */
        'no-warning-comments': [Severity.WARN, {
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
          typescript: {},
        },
      },
    },
    {
      name: '@glyph-cat/eslint-config (ts-only)',
      files: [
        '**/*.ts',
        '**/*.tsx',
      ],
      // ========== TOFIX ==========
      // plugins: {
      //   '@typescript-eslint': typescriptPlugin,
      // },
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': Severity.WARN,
        '@typescript-eslint/no-var-requires': Severity.WARN,
      },
    },
    {
      // Potentially useful reference:
      // https://github.com/valor-software/eslint-config-valorsoft#how-to-use
      name: '@glyph-cat/eslint-config (ignore list)',
      ignores: [
        '**/*.draft*',
        '**/*.scripted*',
        '**/*.secret*',
        '**/*.old*',
        '**/dist/',
        '**/lib/',
        '**/temp/',
        '**/build/',
        '.next/',
      ],
    },
  ]
}
