// import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import { RollupOptions, Plugin as RollupPlugin } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import rootPackageJson from '../../../../package.json'
import {
  customReplace,
  customTerser,
  setDisplayName,
} from '../../../../tools/custom-rollup-plugins'
import { getDependencies } from '../../../../tools/get-dependencies'
import { getSiblingPackages } from '../../../../tools/get-sibling-packages'
import { BuildType } from '../../foundation/src/build'
import packageJson from '../package.json'

const NODE_RESOLVE_EXTENSIONS_BASE = [
  '.tsx',
  '.jsx',
  '.ts',
  '.js',
]

const NODE_RESOLVE_EXTENSIONS_RN = [
  '.native.tsx',
  '.native.jsx',
  '.native.ts',
  '.native.js',
  ...NODE_RESOLVE_EXTENSIONS_BASE,
]

const INPUT_FILE = 'src/index.ts'

const EXTERNAL_LIBS = [
  'node_modules', // TODO: Find out why node_modules is required here, that used to not be the case
  ...getSiblingPackages(),
  ...getDependencies(rootPackageJson),
  ...getDependencies(packageJson),
].sort()

interface IPluginConfig {
  buildType: BuildType
  isProductionTarget?: boolean
}

function getPlugins(config: IPluginConfig): Array<RollupPlugin> {

  const { buildType, isProductionTarget } = config

  const pluginStack: Array<RollupPlugin> = [
    nodeResolve({
      // KIV: using @rollup/plugin-node-resolve v14 or above will cause
      // '.native.(t|j)sx?' files to be ignored
      extensions: NODE_RESOLVE_EXTENSIONS_BASE,
    }),
    commonjs({ sourceMap: false }),
    setDisplayName(!isProductionTarget),
    // babel({
    //   presets: [
    //     // '@babel/preset-env',
    //   ],
    //   plugins: [
    //     // ['@babel/plugin-proposal-class-properties', {
    //     //   // loose: true,
    //     //   // setPublicClassFields: true,
    //     // }],
    //     // ['@babel/plugin-transform-classes', {
    //     //   // loose: true,
    //     // }],
    //   ],
    //   exclude: '**/node_modules/**',
    //   babelHelpers: 'bundled',
    // }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          jsx: 'react-jsx',
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
  {
    // React Native
    input: INPUT_FILE,
    output: {
      file: 'lib/native/index.js',
      format: 'es',
      exports: 'named',
    },
    external: EXTERNAL_LIBS,
    plugins: getPlugins({
      buildType: BuildType.RN,
    }).map((plugin) => {
      if (plugin.name === 'node-resolve') {
        return nodeResolve({
          extensions: NODE_RESOLVE_EXTENSIONS_RN,
        })
      }
      return plugin
    }),
  },
]

export default config
