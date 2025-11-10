import jestPlugin from 'eslint-plugin-jest'
import { Config } from 'eslint/config'
import jestPackage from 'jest/package.json' assert { type: 'json' }
import { Severity } from '../abstractions/public'

export interface JestConfigParams {
  remapOff: Severity
  remapWarn: Severity
  remapError: Severity
}

export function createJestConfig({
  remapOff,
}: JestConfigParams): Array<Config> {
  return [
    {
      name: 'eslint-plugin-jest',
      ...jestPlugin.configs['flat/recommended'],
      settings: {
        version: jestPackage.version,
      },
    },
    {
      name: '@glyph-cat/eslint-config (jest)',
      plugins: {
        'jest': jestPlugin,
      },
      rules: {
        'jest/valid-title': remapOff,
      },
    },
  ]
}
