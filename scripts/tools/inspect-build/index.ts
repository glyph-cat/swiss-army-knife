import chalk from 'chalk'
import { readFileSync } from 'fs'
import { Encoding } from '../../../src/packages/core/src'

const REACT_DOM_PATTERN = /(from\s?|require\()('|")react-dom('|")/
const REACT_NATIVE_PATTERN = /(from\s?|require\()('|")react-native('|")/

// TODO: Disallow imports from react libraries in core package

export function inspectBuild(allowReactPackage?: boolean): void {

  const errorStack: Array<string> = []

  const typeDefinitions = readFileSync('./lib/types/index.d.ts', Encoding.UTF_8)
  if (/M\$/.test(typeDefinitions)) {
    errorStack.push('Unattended internal identifiers (\'M$...\') were found')
  }

  const cjsBundle = readFileSync('./lib/cjs/index.js', Encoding.UTF_8)
  performGenericCheckOnWebBundle('CJS', cjsBundle, errorStack)

  const esBundle = readFileSync('./lib/es/index.js', Encoding.UTF_8)
  performGenericCheckOnWebBundle('ES', esBundle, errorStack)

  const mjsBundle = readFileSync('./lib/es/index.mjs', Encoding.UTF_8)
  performGenericCheckOnWebBundle('MJS', mjsBundle, errorStack)

  const rnBundle = readFileSync('./lib/native/index.js', Encoding.UTF_8)
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
    console.log(chalk.red(`${bullet}${errorStack.join(`\n${bullet}`)}`))
    process.exit(1)
  }

  console.log(chalk.green('✓ Build inspection complete'))

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
