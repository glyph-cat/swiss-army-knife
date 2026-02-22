import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { RollupOptions } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { getPackageDependencies } from '../../project-helpers/src'
import packageJson from '../package.json'

//@ts-expect-error
import nodeResolve from '@rollup/plugin-node-resolve'

const EXTERNAL_LIBS = [
  ...getPackageDependencies(packageJson),
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
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
            declarationDir: null,
            module: 'ESNext',
            outDir: null,
          },
          exclude: [
            './src/**/*.test*',
          ],
        },
      }),
      replace({
        preventAssignment: true,
        values: {
          // 'process.env.NODE_ENV': JSON.stringify('production'),
          // 'process.env.PACKAGE_VERSION': JSON.stringify(version),
          // 'process.env.PACKAGE_BUILD_HASH': JSON.stringify(getRandomHash(6)),
        },
      }),
      terser({
        mangle: {
          properties: {
            regex: /^M/,
          },
        },
      }),
    ],
  },
]

export default config
