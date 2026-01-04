import jestPlugin from 'eslint-plugin-jest'
import { Config, defineConfig } from 'eslint/config'
// import jestPackage from 'jest/package.json' assert { type: 'json' }
import { Severity } from '../abstractions/public'
import { formatName } from '../utils/format-name'

export interface JestConfigParams {
  remapOff: Severity
  remapWarn: Severity
  remapError: Severity
}

export function createJestConfig({
  remapOff,
  remapError,
}: JestConfigParams): Array<Config> {
  return defineConfig(
    jestPlugin.configs['flat/recommended'],
    {
      name: formatName('jest'),
      rules: {
        'jest/expect-expect': remapError,
        'jest/valid-title': remapOff,
      },
      files: [
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
      // settings: {
      //   jest: {
      //     // version: require('jest/package.json').version,
      //     version: jestPackage.version,
      //   },
      // },
    },
  )
}
