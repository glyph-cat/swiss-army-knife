import { Encoding } from '@glyph-cat/foundation'
import chalk from 'chalk'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { PackageJson } from 'type-fest'
import { PACKAGE_JSON } from '../constants'

export function readPackageJson(packagePath: string): PackageJson {
  const fullPath = packagePath.endsWith(PACKAGE_JSON)
    ? packagePath
    : path.join(packagePath, PACKAGE_JSON)
  if (!existsSync(fullPath)) {
    throw new Error(`"${PACKAGE_JSON}" does not exist in "${packagePath}"`)
  }
  const jsonString = readFileSync(fullPath, Encoding.UTF_8)
  try {
    return JSON.parse(jsonString) as PackageJson
  } catch (e) {
    console.log(chalk.red(`Encountered malformed "${PACKAGE_JSON}" in "${fullPath}"`))
    throw e
  }
}
