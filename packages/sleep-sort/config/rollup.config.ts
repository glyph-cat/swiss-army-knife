import {
  customReplace,
  customTerser,
  setDisplayName,
} from '@glyph-cat/custom-tools/custom-rollup-plugins'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { Plugin, RollupOptions } from 'rollup'
import { BuildType } from '../../foundation/src/build'
import packageJson from '../package.json'

const INPUT_FILE = 'src/index.ts'

const EXTERNAL_LIBS = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.devDependencies),
].sort()

const SHARED_GLOBALS = {
  '@sinonjs/fake-timers': 'fakeTimers',
}

const UMD_NAME = 'SleepSort'

interface IPluginConfig {
  buildType: BuildType
  isProductionTarget?: boolean
}

function getPlugins({
  buildType,
  isProductionTarget,
}: IPluginConfig): Array<Plugin> {

  const pluginStack: Array<Plugin> = [
    nodeResolve({
      extensions: ['.ts'],
    }),
    commonjs({ sourceMap: false }),
    setDisplayName(!isProductionTarget),
    typescript({
      compilerOptions: {
        declaration: false,
        declarationDir: null,
        outDir: null,
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
    external: EXTERNAL_LIBS,
    plugins: getPlugins({ buildType: BuildType.CJS }),
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
    external: EXTERNAL_LIBS,
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
    external: EXTERNAL_LIBS,
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
      sourcemap: false,
      globals: SHARED_GLOBALS,
    },
    external: EXTERNAL_LIBS,
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
      sourcemap: false,
      globals: SHARED_GLOBALS,
    },
    external: EXTERNAL_LIBS,
    plugins: getPlugins({
      buildType: BuildType.UMD_MIN,
      isProductionTarget: true,
    }),
  },
]

export default config
