import jestPlugin from 'eslint-plugin-jest'
import { Config, defineConfig } from 'eslint/config'
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
  return defineConfig(
    jestPlugin.configs['flat/recommended'],
    // {
    //   name: 'eslint-plugin-jest',
    //   ...jestPlugin.configs['flat/recommended'],
    // },
    {
      name: '@glyph-cat/eslint-config (jest)',
      // plugins: {
      //   'jest': jestPlugin,
      // },
      rules: {
        'jest/valid-title': remapOff,
      },
      // KIV: still not sure if `files` works as intended
      // files: [
      //   '**.test.js',
      //   '**.test.jsx',
      //   '**.test.ts',
      //   '**.test.tsx',
      // ],
      settings: {
        jest: {
          version: jestPackage.version,
        },
      },
    },
  )
}
