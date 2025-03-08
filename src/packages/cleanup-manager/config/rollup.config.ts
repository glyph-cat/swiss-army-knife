import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { execSync } from 'child_process'
import { RollupOptions, Plugin as RollupPlugin } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import pkg from '../package.json'

const INPUT_FILE = 'src/index.ts'

const UMD_NAME = 'CleanupManager'

interface IPluginConfig {
  overrides?: Record<string, unknown>
}

function getPlugins(config: IPluginConfig): Array<RollupPlugin> {
  const { overrides = {} } = config
  const basePlugins = {
    nodeResolve: nodeResolve({
      extensions: ['.ts'],
    }),
    typescript: typescript({
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
    // commonjs: commonjs(),
  }

  // Override plugins
  for (const overrideKey in overrides) {
    basePlugins[overrideKey] = overrides[overrideKey]
  }

  // Convert plugins object to array
  const pluginStack: Array<RollupPlugin> = []
  for (const i in basePlugins) {
    // Allows plugins to be excluded by replacing them with falsy values
    if (basePlugins[i]) {
      pluginStack.push(basePlugins[i])
    }
  }

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
    plugins: getPlugins({}),
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
    plugins: getPlugins({}),
  },
  {
    // UMD (Minified)
    input: INPUT_FILE,
    output: {
      file: 'lib/umd/index.min.js',
      format: 'umd',
      name: UMD_NAME,
      exports: 'named',
      sourcemap: true,
    },
    plugins: getPlugins({}),
  },
]

export default config
