import { customReplace, customTerser } from '@glyph-cat/custom-tools/custom-rollup-plugins'
import { BuildType } from '@glyph-cat/foundation'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { Plugin, RollupOptions } from 'rollup'
import packageJson from '../package.json'

const INPUT_FILE = 'src/index.ts'

const EXTERNAL_LIBS = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.devDependencies),
]

function getPlugins(buildType: BuildType): Array<Plugin> {
  const pluginStack: Array<Plugin> = [
    nodeResolve({
      extensions: ['.ts'],
    }),
    commonjs({ sourceMap: false }),
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
    customReplace(
      true,
      buildType,
      packageJson.version,
    ),
    customTerser(),
    // commonjs(),
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
    plugins: getPlugins(BuildType.CJS),
  },
  {
    // EcmaScript (Minified)
    input: INPUT_FILE,
    output: {
      file: 'lib/es/index.mjs',
      format: 'es',
      exports: 'named',
      sourcemap: false,
    },
    external: EXTERNAL_LIBS,
    plugins: getPlugins(BuildType.MJS),
  },
]

export default config
