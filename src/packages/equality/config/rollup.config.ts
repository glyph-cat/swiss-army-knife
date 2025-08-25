import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { RollupOptions, Plugin as RollupPlugin } from 'rollup'
import typescript from 'rollup-plugin-typescript2'

const INPUT_FILE = 'src/index.ts'

const UMD_NAME = 'Equality'

function getPlugins(): Array<RollupPlugin> {

  const pluginStack: Array<RollupPlugin> = [
    nodeResolve({
      extensions: ['.ts'],
    }),
    commonjs({ sourceMap: false }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          declarationDir: null,
          outDir: null,
        },
        exclude: [
          './src/**/*.test*',
        ],
      },
    }),
    terser({
      mangle: {
        properties: {
          regex: /^(M\$|_)/,
        },
      },
    })
  ]

  return pluginStack
}

const config: Array<RollupOptions> = [
  {
    // CommonJS
    input: INPUT_FILE,
    output: {
      file: 'lib/cjs/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
    },
    plugins: getPlugins(),
  },
  {
    // EcmaScript
    input: INPUT_FILE,
    output: {
      file: 'lib/es/index.js',
      format: 'es',
      exports: 'named',
      sourcemap: false,
    },
    plugins: getPlugins(),
  },
  {
    // UMD
    input: INPUT_FILE,
    output: {
      file: 'lib/umd/index.js',
      format: 'umd',
      name: UMD_NAME,
      exports: 'named',
      sourcemap: true,
    },
    plugins: getPlugins(),
  },
]

export default config
