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

export function removeTestProbes(): Plugin {
  return {
    name: 'remove-test-probes',
    transform(code) {
      // If `.+` then will also cause the declaration `export function useTestProbe()...` to match
      const testProbeSyntaxPattern = /useTestProbe\([A-za-z0-9_.]+\)/
      // if (testProbeSyntaxPattern.test(code)) {
      //   console.log('output\n\n', code.split('\n').filter((line) => {
      //     return !testProbeSyntaxPattern.test(line)
      //   }).join('\n'))
      // }
      return code.split('\n').filter((line) => {
        return !testProbeSyntaxPattern.test(line)
      }).join('\n')
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
      // === IMPORTANT NOTE ===
      // All `process.env.__` variables are strings, and in source environment,
      // it doesn't even have a value, so we can only compare using inverse logic
      // in conjunction with the `==` operator.
      'process.env.IS_SOURCE_ENV': JSON.stringify('0'),
      'process.env.IS_PRODUCTION_TARGET': typeof isProductionTarget === 'boolean'
        ? JSON.stringify(isProductionTarget ? '1' : '0')
        : '(process.env.NODE_ENV === "production")',
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
        // TODO: Change all `_variables` to `M$variables` to avoid messing with variables from other libraries that also uses the `_` prefix by accident
        // KIV: For now, it seems like all are using `M$` already
        regex: /^(M\$|_)/,
        ...otherProperties,
      },
    },
  })
}
