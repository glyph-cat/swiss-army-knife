import chalk from 'chalk'
import { readFileSync } from 'fs'
import { ENCODING_UTF_8 } from '../../constants'

const REACT_DOM_PATTERN = /('|")react-dom('|")/
const REACT_NATIVE_PATTERN = /('|")react-native('|")/

export function inspectBuild(path: string): void {

  const errorStack: Array<string> = []

  const typeDefinitions = readFileSync(`${path}/lib/types/index.d.ts`, ENCODING_UTF_8)
  if (/M$/.test(typeDefinitions)) {
    errorStack.push(`Unattended internal identifiers were detected`)
  }

  const cjsBundle = readFileSync(`${path}/lib/cjs/index.js`, ENCODING_UTF_8)
  performGenericCheckOnWebBundle('MJS', cjsBundle, errorStack)

  const esBundle = readFileSync(`${path}/lib/es/index.js`, ENCODING_UTF_8)
  performGenericCheckOnWebBundle('MJS', esBundle, errorStack)

  const mjsBundle = readFileSync(`${path}/lib/es/index.mjs`, ENCODING_UTF_8)
  performGenericCheckOnWebBundle('MJS', mjsBundle, errorStack)

  const rnBundle = readFileSync(`${path}/lib/native/index.js`, ENCODING_UTF_8)
  if (!REACT_NATIVE_PATTERN.test(rnBundle)) {
    errorStack.push('React Native counterparts (Eg: index.native.ts) were not bundled into the final code')
  } else {
    const webAPIReferenceMatches = rnBundle.match(/(window|document|navigator)\./)
    if (webAPIReferenceMatches?.length > 0) {
      const bullet = '\n   - '
      errorStack.push(`React Native bundle cannot contain Web API references:${bullet}${webAPIReferenceMatches.join(bullet)}`)
    }
    if (REACT_DOM_PATTERN.test(rnBundle)) {
      errorStack.push('React Native bundle cannot contain imports from \'react-dom\'')
    }
  }

  if (errorStack.length > 0) {
    const bullet = ' - '
    console.log(chalk.red(`${bullet}${errorStack.join(bullet)}`))
    process.exit(1)
  }

  console.log(chalk.green('✓ Build inspection complete - no anomalies detected'))

}

function performGenericCheckOnWebBundle(
  bundleType: 'CJS' | 'ES' | 'MJS',
  code: string,
  errorStack: Array<string>,
): void {
  if (REACT_NATIVE_PATTERN.test(code)) {
    errorStack.push(`${bundleType} bundle cannot contain imports from 'react-native'`)
  }
}
