import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import { Config, defineConfig } from 'eslint/config'
import { Severity } from '../abstractions/public'
import { compat } from '../utils/compat'

export interface ReactConfigParams {
  remapOff: Severity
  remapWarn: Severity
  remapError: Severity
  isLibraryAuthoring?: boolean
}

export function createReactConfig({
  remapOff,
  remapWarn,
  remapError,
  isLibraryAuthoring,
}: ReactConfigParams): Array<Config> {
  return defineConfig(
    {
      name: 'eslint-plugin-react',
      ...compat.extends('plugin:react/recommended')[0],
      settings: {
        // See: https://github.com/benmosher/eslint-plugin-import/issues/1485#issuecomment-571597574
        'react': {
          pragma: 'React',
          fragment: 'Fragment',
          version: 'detect',
        },
      },
    },
    reactHooksPlugin.configs.flat['recommended-latest'],
    // {
    //   name: 'eslint-plugin-react-hooks',
    //   ...compat.extends('plugin:react-hooks/recommended')[0],
    // },
    {
      name: '@glyph-cat/eslint-config (react)',
      plugins: {
        'react': reactPlugin,
        // 'react-hooks': reactHooksPlugin,
      },
      rules: {
        'react/display-name': remapOff,
        'react/jsx-no-bind': remapWarn,
        'react/no-children-prop': remapError,
        'react/prop-types': remapOff,
        'react/react-in-jsx-scope': remapOff, // React ≥17 has new JSX transform
        'react-hooks/exhaustive-deps': [remapWarn, {
          additionalHooks: 'useInsertionEffect'
        }],
      },
    },
  )
}
