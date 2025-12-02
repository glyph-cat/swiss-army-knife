import replace, { RollupReplaceOptions } from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { execSync } from 'child_process'
import { Plugin } from 'rollup'
import { ManglePropertiesOptions } from 'terser'
import { PossiblyUndefined } from '../../src/packages/foundation/src/void-types'

export function setDisplayName(enabled: boolean): Plugin {
  // For now it seems like we need to rely on `global`, would this work in RN though?
  return {
    name: 'set-display-name',
    transform(code) {
      const pattern = /__setDisplayName\([a-zA-Z0-9_-]+\)/g
      if (enabled) {
        return code.replace(pattern, (str) => {
          const itemName = str.replace(/^__setDisplayName\(/, '').replace(/\)$/, '')
          return [
            `${itemName}.displayName = '${itemName}'`,
          ].join(';') + ';'
        })
      } else {
        return code.replace(pattern, '')
      }
    },
  }
}

export function customReplace(
  isProductionTarget: PossiblyUndefined<boolean>,
  buildEnv: string,
  version: string,
  otherValues?: RollupReplaceOptions['values'],
): ReturnType<typeof replace> {
  return replace({
    preventAssignment: true,
    values: {
      'process.env.IS_SOURCE_ENV': JSON.stringify(String(false)),
      'process.env.IS_PRODUCTION_TARGET': JSON.stringify(
        typeof isProductionTarget === 'boolean'
          ? String(isProductionTarget)
          : 'process.env.NODE_ENV === "production"'
      ),
      'process.env.PACKAGE_BUILD_HASH': JSON.stringify(
        execSync('git rev-parse HEAD').toString().trim(),
      ),
      'process.env.PACKAGE_BUILD_TYPE': JSON.stringify(buildEnv),
      'process.env.PACKAGE_VERSION': JSON.stringify(version),
      ...otherValues,
    },
  })
}

export function customTerser(
  otherProperties?: ManglePropertiesOptions,
): ReturnType<typeof terser> {
  return terser({
    mangle: {
      properties: {
        regex: /^(M\$|_)/,
        ...otherProperties,
      },
    },
  })
}
