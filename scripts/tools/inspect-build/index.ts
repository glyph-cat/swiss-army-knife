import chalk from 'chalk'
import { readFileSync } from 'fs'
import { ENCODING_UTF_8 } from '../../constants'

export function inspectBuild(path: string): void {

  const errors: Array<string> = []

  const typeDefinitions = readFileSync(`${path}/lib/types/index.d.ts`, ENCODING_UTF_8)
  if (/M$/.test(typeDefinitions)) {
    errors.push(`Unattended internal identifiers were detected`)
  }

  const REACT_NATIVE_PATTERN = /('|")react-native('|")/

  const rnBundle = readFileSync(`${path}/lib/native/index.js`, ENCODING_UTF_8)
  if (!REACT_NATIVE_PATTERN.test(rnBundle)) {
    errors.push('React Native counterparts (Eg: index.native.ts) were not used for the bundle')
  } else if (/(window|document|navigator)\./.test(rnBundle)) {
    errors.push('React Native bundle cannot contain Web API references')
  }

  const cjsBundle = readFileSync(`${path}/lib/cjs/index.js`, ENCODING_UTF_8)
  if (REACT_NATIVE_PATTERN.test(cjsBundle)) {
    errors.push('CJS bundle cannot contain React Native references')
  }

  const esBundle = readFileSync(`${path}/lib/es/index.js`, ENCODING_UTF_8)
  if (REACT_NATIVE_PATTERN.test(esBundle)) {
    errors.push('ES bundle cannot contain React Native references')
  }

  const mjsBundle = readFileSync(`${path}/lib/es/index.mjs`, ENCODING_UTF_8)
  if (REACT_NATIVE_PATTERN.test(mjsBundle)) {
    errors.push('MJS bundle cannot contain React Native references')
  }

  if (errors.length > 0) {
    const bullet = ' - '
    console.log(chalk.red(`${bullet}${errors.join(bullet)}`))
    process.exit(1)
  }

  console.log(chalk.green('✓ Build inspection complete - no anomalies detected'))

}
