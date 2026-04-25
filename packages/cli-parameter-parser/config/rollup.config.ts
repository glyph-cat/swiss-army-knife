import {
  customReplace,
  customTerser,
} from '@glyph-cat/custom-tools/custom-rollup-plugins'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { RollupOptions } from 'rollup'
import { BuildType } from '../../foundation/src/build'
import packageJson from '../package.json'

const EXTERNAL_LIBS = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.devDependencies),
].sort()

const config: Array<RollupOptions> = [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/cjs/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
    },
    external: EXTERNAL_LIBS,
    plugins: [
      nodeResolve({
        extensions: ['.ts', '.js'],
        preferBuiltins: true,
      }),
      commonjs({ sourceMap: false }),
      typescript({
        compilerOptions: {
          declaration: false,
          declarationDir: null,
          // module: 'ESNext',
          outDir: null,
        },
      }),
      customReplace(
        true,
        BuildType.CJS,
        packageJson.version,
      ),
      customTerser(),
    ],
  },
]

export default config
