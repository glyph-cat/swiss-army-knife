import commonjs from '@rollup/plugin-commonjs'
import { RollupOptions, Plugin as RollupPlugin } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import {
  customReplace,
  customTerser,
  setDisplayName,
} from '../../../../tools/custom-rollup-plugins'
import packageJson from '../package.json'
import { BuildType, Empty } from '../src'

// @ts-expect-error because we are relying on an old version
import nodeResolve from '@rollup/plugin-node-resolve'

const NODE_RESOLVE_EXTENSIONS_BASE = [
  '.tsx',
  '.jsx',
  '.ts',
  '.js',
]

const INPUT_FILE = 'src/index.ts'

const EXTERNAL_LIBS = Empty.ARRAY as Array<string> // Not supposed to have any other dependencies

interface IPluginConfig {
  buildType: BuildType
  isProductionTarget?: boolean
}

function getPlugins(config: IPluginConfig): Array<RollupPlugin> {

  const { buildType, isProductionTarget } = config

  const pluginStack: Array<RollupPlugin> = [
    nodeResolve({
      extensions: NODE_RESOLVE_EXTENSIONS_BASE,
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
    },
    external: EXTERNAL_LIBS,
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
    },
    external: EXTERNAL_LIBS,
    plugins: getPlugins({
      buildType: BuildType.ES,
    }),
  },
  {
    // EcmaScript for browsers
    input: INPUT_FILE,
    output: {
      file: 'lib/es/index.mjs',
      format: 'es',
      exports: 'named',
    },
    external: EXTERNAL_LIBS,
    plugins: getPlugins({
      buildType: BuildType.MJS,
      isProductionTarget: true,
    }),
  },
]

export default config
