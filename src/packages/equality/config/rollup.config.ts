import commonjs from '@rollup/plugin-commonjs'
import { RollupOptions, Plugin as RollupPlugin } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import {
  customReplace,
  customTerser,
  setDisplayName,
} from '../../../../tools/custom-rollup-plugins'
import { BuildType } from '../../foundation/src/build'
import packageJson from '../package.json'

// @ts-expect-error because we are relying on an old version
import nodeResolve from '@rollup/plugin-node-resolve'

const INPUT_FILE = 'src/index.ts'

const UMD_NAME = 'Equality'

interface IPluginConfig {
  buildType: BuildType
  isProductionTarget?: boolean
}

function getPlugins({
  buildType,
  isProductionTarget,
}: IPluginConfig): Array<RollupPlugin> {

  const pluginStack: Array<RollupPlugin> = [
    nodeResolve({
      extensions: ['.ts'],
    }),
    commonjs({ sourceMap: false }),
    setDisplayName(!isProductionTarget),
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
    customReplace(
      isProductionTarget,
      buildType,
      packageJson.version,
    ),
    customTerser(),
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
    plugins: getPlugins({
      buildType: BuildType.CJS,
    }),
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
    plugins: getPlugins({
      buildType: BuildType.ES,
    }),
  },
  {
    // EcmaScript (minified)
    input: INPUT_FILE,
    output: {
      file: 'lib/es/index.mjs',
      format: 'es',
      exports: 'named',
      sourcemap: false,
    },
    plugins: getPlugins({
      buildType: BuildType.MJS,
      isProductionTarget: true,
    }),
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
    plugins: getPlugins({
      buildType: BuildType.UMD,
    }),
  },
  {
    // UMD (minified)
    input: INPUT_FILE,
    output: {
      file: 'lib/umd/index.min.js',
      format: 'umd',
      name: UMD_NAME,
      exports: 'named',
      sourcemap: true,
    },
    plugins: getPlugins({
      buildType: BuildType.UMD,
      isProductionTarget: true,
    }),
  },
]

export default config
