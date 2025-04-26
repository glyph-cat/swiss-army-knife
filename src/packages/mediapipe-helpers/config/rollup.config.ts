import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { execSync } from 'child_process'
import { RollupOptions, Plugin as RollupPlugin } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import rootPackageJson from '../../../../package.json'
import { getDependencies } from '../../../../tools/get-dependencies'
import pkg from '../package.json'

const INPUT_FILE = 'src/index.ts'

const EXTERNAL_LIBS = [
  'node_modules',
  '@glyph-cat/swiss-army-knife',
  ...getDependencies(rootPackageJson),
].sort()

// const UMD_NAME = 'MLHelpers'

function getPlugins(): Array<RollupPlugin> {

  const pluginStack: Array<RollupPlugin> = [
    nodeResolve({
      extensions: ['.ts'],
    }),
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
    // commonjs(),
  ]

  // Replace values
  const replaceValues = {
    'process.env.BUILD_HASH': JSON.stringify(
      execSync('git rev-parse HEAD').toString().trim()
    ),
    'process.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
  }

  pluginStack.push(replace({
    preventAssignment: true,
    values: replaceValues,
  }))

  pluginStack.push(terser({
    mangle: {
      properties: {
        regex: /^M\$/,
      },
    },
  }))

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
    external: EXTERNAL_LIBS,
    plugins: getPlugins(),
  },
  {
    // EcmaScript (Minified)
    input: INPUT_FILE,
    output: {
      file: 'lib/es/index.mjs',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    external: EXTERNAL_LIBS,
    plugins: getPlugins(),
  },
  // {
  //   // UMD (Minified)
  //   input: INPUT_FILE,
  //   output: {
  //     file: 'lib/umd/index.min.js',
  //     format: 'umd',
  //     name: UMD_NAME,
  //     exports: 'named',
  //     sourcemap: true,
  //     globals: {
  //       '@glyph-cat/swiss-army-knife': 'GCSwissArmyKnife',
  //     },
  //   },
  //   external: EXTERNAL_LIBS,
  //   plugins: getPlugins(),
  // },
]

export default config
