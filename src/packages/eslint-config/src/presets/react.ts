import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import { Config, defineConfig } from 'eslint/config'
import { Severity } from '../abstractions/public'
import { formatName } from '../utils/format-name'

const OFF = Severity.OFF

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
    reactPlugin.configs.flat.recommended,
    reactHooksPlugin.configs.flat['recommended-latest'],
    {
      name: formatName('react'),
      rules: {
        '@stylistic/jsx-curly-brace-presence': OFF, // KIV: prefer to have most of the time to make searching string values easier, except for props such as `layout='vertical'`
        '@stylistic/jsx-one-expression-per-line': Severity.OFF,
        '@stylistic/jsx-quotes': [remapWarn, 'prefer-single'],
        'react/display-name': remapOff,
        'react/no-children-prop': remapError,
        'react/prop-types': remapOff,
        'react/react-in-jsx-scope': remapOff, // React ≥17 has new JSX transform
        'react-hooks/refs': OFF,
        'react-hooks/exhaustive-deps': [remapWarn, {
          additionalHooks: 'useInsertionEffect',
        }],
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  )
}
