import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { execSync } from 'child_process'
import { RollupOptions, Plugin as RollupPlugin } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { setDisplayName } from '../../../../tools/custom-rollup-plugins'
import { getDependenciesFromRoot } from '../../../../tools/get-dependencies'
import { BuildType } from '../../foundation/src/build'
import packageJson from '../package.json'

const INPUT_FILE = 'src/index.ts'

const EXTERNAL_LIBS = [
  ...getDependenciesFromRoot(),
]

interface IPluginConfig {
  buildEnv: BuildType
}

function getPlugins(config: IPluginConfig): Array<RollupPlugin> {

  const { buildEnv } = config

  const pluginStack: Array<RollupPlugin> = [
    commonjs({ sourceMap: false }),
    setDisplayName(false),
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
  ]

  // Replace values
  const replaceValues = {
    'process.env.PACKAGE_BUILD_HASH': JSON.stringify(
      execSync('git rev-parse HEAD').toString().trim()
    ),
    'process.env.PACKAGE_BUILD_TYPE': JSON.stringify(buildEnv),
    'process.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
  }
  pluginStack.push(replace({
    preventAssignment: true,
    values: replaceValues,
  }))

  // Minification and cleanup
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
    },
    external: EXTERNAL_LIBS,
    plugins: getPlugins({
      buildEnv: BuildType.CJS,
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
    }),
  },
]

export default config
