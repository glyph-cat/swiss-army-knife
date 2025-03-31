import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { execSync } from 'child_process'
import { RollupOptions, Plugin as RollupPlugin } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import rootPackageJson from '../../../../package.json'
import { assignDisplayName } from '../../../../tools/custom-rollup-plugins'
import { getDependencies } from '../../../../tools/get-dependencies'
import { version } from '../package.json'
import { BuildType } from '../src/constants/public'

const INPUT_FILE = 'src/index.ts'

const EXTERNAL_LIBS = [
  ...getDependencies(rootPackageJson),
]

interface IPluginConfig {
  buildEnv: BuildType
}

function getPlugins(config: IPluginConfig): Array<RollupPlugin> {

  const { buildEnv } = config

  const pluginStack: Array<RollupPlugin> = [
    assignDisplayName(false),
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
    'process.env.BUILD_HASH': JSON.stringify(
      execSync('git rev-parse HEAD').toString().trim()
    ),
    'process.env.BUILD_TYPE': JSON.stringify(buildEnv),
    'process.env.PACKAGE_VERSION': JSON.stringify(version),
  }
  pluginStack.push(replace({
    preventAssignment: true,
    values: replaceValues,
  }))

  // Minification and cleanup
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
