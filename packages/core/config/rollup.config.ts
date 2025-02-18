/* eslint-disable @typescript-eslint/no-var-requires */
// import babel from '@rollup/plugin-babel'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import autoprefixer from 'autoprefixer'
import { execSync } from 'child_process'
import { RollupOptions, Plugin as RollupPlugin } from 'rollup'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import { version } from '../package.json'
import { BuildType } from '../src/constants/public'

const NODE_RESOLVE_EXTENSIONS_BASE = ['.tsx', '.jsx', '.ts', '.js']

const NODE_RESOLVE_EXTENSIONS_WEB = [
  // NOTE: This is to accommodate 3rd party libraries in rare cases.
  // For this project, always use '.ts' for web implementation.
  '.web.tsx',
  '.web.jsx',
  '.web.ts',
  '.web.js',
  ...NODE_RESOLVE_EXTENSIONS_BASE,
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
  'node_modules',
  'react/jsx-runtime', // https://stackoverflow.com/a/71396781/5810737
  ...Object.keys(require('../package.json').dependencies ?? {}),
  ...Object.keys(require('../package.json').devDependencies ?? {}),
].sort()

interface IPluginConfig {
  overrides?: Record<string, unknown>
  mode?: 'development' | 'production'
  buildEnv: BuildType
}

function getPlugins(config: IPluginConfig): Array<RollupPlugin> {
  const { overrides = {}, mode, buildEnv } = config
  const basePlugins = {
    nodeResolve: nodeResolve(),
    // babel: babel({
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
    postcss: postcss({
      plugins: [autoprefixer()],
      sourceMap: false,
      extract: false,
      minimize: true,
    }),
    typescript: typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          jsx: 'react-jsx',
          declarationDir: null,
          outDir: null,
        },
      },
    }),
  }

  // Override plugins
  for (const overrideKey in overrides) {
    basePlugins[overrideKey] = overrides[overrideKey]
  }

  // Convert plugins object to array
  const pluginStack: Array<RollupPlugin> = []
  for (const basePluginKey in basePlugins) {
    // Allows plugins to be excluded by replacing them with falsy values
    if (basePlugins[basePluginKey]) {
      pluginStack.push(basePlugins[basePluginKey])
    }
  }

  // Replace values
  const replaceValues = {
    'process.env.BUILD_HASH': JSON.stringify(
      execSync('git rev-parse HEAD').toString().trim()
    ),
    'process.env.BUILD_TYPE': JSON.stringify(buildEnv),
    'process.env.IS_INTERNAL_DEBUG_ENV': JSON.stringify('false'),
    'process.env.PACKAGE_VERSION': JSON.stringify(version),
  }
  if (mode) {
    replaceValues['process.env.NODE_ENV'] = JSON.stringify(mode)
  }
  pluginStack.push(replace({
    preventAssignment: true,
    values: replaceValues,
  }))

  // Minification and cleanup
  // if (mode === 'production') { }
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
    },
    external: EXTERNAL_LIBS,
    plugins: getPlugins({
      buildEnv: BuildType.CJS,
      overrides: {
        nodeResolve: nodeResolve({
          extensions: NODE_RESOLVE_EXTENSIONS_WEB,
        }),
      },
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
      buildEnv: BuildType.ES,
      overrides: {
        nodeResolve: nodeResolve({
          extensions: NODE_RESOLVE_EXTENSIONS_WEB,
        }),
      },
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
      buildEnv: BuildType.MJS,
      mode: 'production',
      overrides: {
        nodeResolve: nodeResolve({
          extensions: NODE_RESOLVE_EXTENSIONS_WEB,
        }),
      },
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
      buildEnv: BuildType.RN,
      overrides: {
        nodeResolve: nodeResolve({
          extensions: NODE_RESOLVE_EXTENSIONS_RN,
        }),
      },
    }),
  },
]

export default config
