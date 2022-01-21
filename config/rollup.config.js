import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import autoprefixer from 'autoprefixer'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import { version } from '../package.json'

const NODE_RESOLVE_EXTENSIONS_BASE = ['.tsx', '.jsx', '.ts', '.js']

const NODE_RESOLVE_EXTENSIONS_WEB = [
  // NOTE: This is to accomodate 3rd party libraries in rare cases.
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
  ...Object.keys(require('../package.json').dependencies),
  ...Object.keys(require('../package.json').devDependencies),
].sort()

/**
 * @param {object} config
 * @param {object} config.overrides
 * @param {'development'|'production'?} config.mode
 * @param {string?} config.buildEnv
 * @returns {Array}
 */
function getPlugins(config = {}) {
  const { overrides = {}, mode, buildEnv } = config
  const basePlugins = {
    nodeResolve: nodeResolve(),
    autoImportReact: autoImportReact(),
    babel: babel({
      presets: ['@babel/preset-react'],
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
      ],
      exclude: '**/node_modules/**',
      babelHelpers: 'bundled',
    }),
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
          jsx: 'react',
          declarationDir: null,
          outDir: null,
        },
      },
    }),
    commonjs: commonjs(),
  }

  // Override plugins
  for (const overrideKey in overrides) {
    basePlugins[overrideKey] = overrides[overrideKey]
  }

  // Convert plugins object to array
  const pluginStack = []
  for (const i in basePlugins) {
    // Allows plugins to be excluded by replacing them with falsy values
    if (basePlugins[i]) {
      pluginStack.push(basePlugins[i])
    }
  }

  // Replace values
  const replaceValues = {
    'process.env.BUILD_TYPE': JSON.stringify(buildEnv),
    'process.env.IS_INTERNAL_DEBUG_ENV': JSON.stringify('false'),
    'process.env.NPM_PACKAGE_VERSION': JSON.stringify(version),
  }
  if (mode) {
    replaceValues['process.env.NODE_ENV'] = JSON.stringify(mode)
  }
  pluginStack.push(replace({
    preventAssignment: true,
    values: replaceValues,
  }))

  // Minification and cleanup
  if (mode === 'production') {
    const terserPlugin = terser({ mangle: { properties: { regex: /^M\$/ } } })
    pluginStack.push(terserPlugin)
  }
  pluginStack.push(forceCleanup())

  return pluginStack
}

const config = [
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
      buildEnv: 'cjs',
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
      buildEnv: 'es',
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
      buildEnv: 'mjs',
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
      buildEnv: 'rn',
      overrides: {
        nodeResolve: nodeResolve({
          extensions: NODE_RESOLVE_EXTENSIONS_RN,
        }),
      },
    }),
  },
]

export default config

/**
 * Automatically `imports React from "react"` if a file ends with '.tsx'.
 */
function autoImportReact() {
  return {
    name: 'autoImportReact',
    transform(code, id) {
      if (/tsx/gi.test(id)) {
        code = 'import React from "react";\n' + code
        return { code }
      }
      return null
    },
  }
}

/**
 * Removes redundant license information about tslib that is wasting precious
 * bytes in the final code bundle.
 */
function forceCleanup() {
  return {
    name: 'forceCleanup',
    transform(code, id) {
      if (id.includes('tslib')) {
        const indexOfFirstCommentCloseAsterisk = code.indexOf('*/')
        if (indexOfFirstCommentCloseAsterisk >= 0) {
          // +2 to include the 2 searched characters as well
          code = code.substring(
            indexOfFirstCommentCloseAsterisk + 2,
            code.length
          )
        }
        return { code }
      }
      return null
    },
  }
}
