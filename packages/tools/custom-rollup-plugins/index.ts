import replace, { RollupReplaceOptions } from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { execSync } from 'node:child_process'
import { Plugin } from 'rollup'
import { ManglePropertiesOptions } from 'terser'
import { PossiblyUndefined } from '../../foundation/src/void-types'

export function setDisplayName(enabled: boolean): Plugin {
  // For now it seems like we need to rely on `global`, would this work in RN though?
  return {
    name: 'set-display-name',
    transform(code, path) {
      if (/packages\/[a-zA-Z0-9_-]+\/src\/_internals\/index/.test(path)) {
        return code
      }
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
  // const REACT_TEST_UTILS = '@glyph-cat/react-test-utils'
  return {
    name: 'remove-test-probes',
    // KIV: resolveId was never once called with '@glyph-cat/react-test-utils'
    // resolveId(source) {
    //   console.log('source', source)
    //   if (source === REACT_TEST_UTILS) {
    //     return `\0${REACT_TEST_UTILS}`
    //   }
    //   return null
    // },
    // load(id) {
    //   console.log('id', id)
    //   if (id === `\0${REACT_TEST_UTILS}`) {
    //     return '' // No code
    //   }
    //   return null
    // },
    transform(code) {
      const testProbeSyntaxPattern = /useTestProbe\([A-za-z0-9_.]+\)/
      const testProbeImportPattern = /from '@glyph-cat\/react-test-utils'/
      if (testProbeSyntaxPattern.test(code) || testProbeImportPattern.test(code)) {
        return code.split('\n').filter((line) => {
          return !testProbeSyntaxPattern.test(line) && !testProbeImportPattern.test(line)
        }).join('\n')
      }
      return code
    },
  }
}

export function customReplace(
  isProductionTarget: PossiblyUndefined<boolean>,
  buildEnv: string,
  version: string,
  otherValues?: RollupReplaceOptions['values'],
): Plugin {
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
): Plugin {
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
