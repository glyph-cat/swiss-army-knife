import chalk from 'chalk'
import { readFileSync } from 'fs'
import { ENCODING_UTF_8 } from '../constants'

export function inspectBuild(path: string): void {

  const errors: Array<string> = []

  const typeDefinitions = readFileSync(`${path}/lib/types/index.d.ts`, ENCODING_UTF_8)
  if (/M$/.test(typeDefinitions)) {
    errors.push(`Unattended internal identifiers were detected`)
  }

  const rnBundle = readFileSync(`${path}/lib/native/index.js`, ENCODING_UTF_8)
  if (!/('|")react-native('|")/.test(rnBundle)) {
    errors.push('React Native counterparts (Eg: index.native.ts) are not being used for the bundle')
  } else if (/(window|document|navigator)\./.test(rnBundle)) {
    errors.push('React Native bundle contains Web API references')
  }

  if (errors.length > 0) {
    const bullet = ' - '
    console.log(chalk.red(`${bullet}${errors.join(bullet)}`))
    process.exit(1)
  }

}
