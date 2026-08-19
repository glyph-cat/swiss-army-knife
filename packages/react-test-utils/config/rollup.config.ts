import {
  customReplace,
  customTerser,
  setDisplayName,
} from '@glyph-cat/custom-tools/custom-rollup-plugins'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { Plugin, RollupOptions } from 'rollup'
import { BuildType } from '../../foundation/src/build'
import packageJson from '../package.json'

const INPUT_FILE = 'src/index.ts'

const EXTERNAL_LIBS = [
  'react/jsx-runtime',
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.devDependencies),
]

interface IPluginConfig {
  buildType: BuildType
}

function getPlugins({
  buildType,
}: IPluginConfig): Array<Plugin> {

  const pluginStack: Array<Plugin> = [
    commonjs({ sourceMap: false }),
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
    setDisplayName(false),
    customReplace(
      true,
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
]

export default config
