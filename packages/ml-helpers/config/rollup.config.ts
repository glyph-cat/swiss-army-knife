import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { execSync } from 'child_process'
import { RollupOptions, Plugin as RollupPlugin } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { getDependenciesFromRoot } from '../../../../tools/get-dependencies'
import packageJson from '../package.json'

// @ts-expect-error because we are relying on an old version
import nodeResolve from '@rollup/plugin-node-resolve'

const INPUT_FILE = 'src/index.ts'

const EXTERNAL_LIBS = [
  'node_modules',  // TODO: Find out why node_modules is required here
  ...getDependenciesFromRoot(),
].sort()

// const UMD_NAME = 'MLHelpers'

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
    // commonjs(),
  ]

  // Replace values
  const replaceValues = {
    'process.env.PACKAGE_BUILD_HASH': JSON.stringify(
      execSync('git rev-parse HEAD').toString().trim()
    ),
    'process.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
  }

  pluginStack.push(replace({
    preventAssignment: true,
    values: replaceValues,
  }))

  pluginStack.push(terser({
    mangle: {
      properties: {
        regex: /^(M\$|_)/,
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
