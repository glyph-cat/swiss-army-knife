import { customTerser } from '@glyph-cat/custom-tools/custom-rollup-plugins'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { RollupOptions } from 'rollup'
import packageJson from '../package.json'


function getConfig(inputPath: string, outputPath: string): RollupOptions {
  return {
    input: inputPath,
    output: {
      file: outputPath,
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
    },
    external: [
      ...Object.keys(packageJson.dependencies),
      ...Object.keys(packageJson.devDependencies),
    ],
    plugins: [
      nodeResolve({
        extensions: ['.ts'],
      }),
      typescript({
        compilerOptions: {
          declaration: false,
          declarationDir: null,
          outDir: null,
        },
      }),
      commonjs(),
      customTerser(),
    ],
  }
}

const config: Array<RollupOptions> = [
  getConfig('./src/index.ts', './lib/index.js'),
  getConfig('./src/bundle-entry-point/base.ts', './base/lib/index.js'),
  getConfig('./src/bundle-entry-point/jest.ts', './jest/lib/index.js'),
  getConfig('./src/bundle-entry-point/react.ts', './react/lib/index.js'),
]

export default config
