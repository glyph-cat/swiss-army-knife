import chalk from 'chalk'
import { existsSync, readFileSync } from 'fs'
import Path from 'path'
import { PackageJson } from 'type-fest'
import { Encoding } from '../../src/packages/foundation/src/encoding'

const PACKAGE_JSON = 'package.json'

export function readPackageJson(path: string): PackageJson {
  const fullPath = Path.join(path, PACKAGE_JSON)
  if (!existsSync(fullPath)) {
    throw new Error(`Missing "${PACKAGE_JSON}" in "${path}"`)
  }
  const jsonString = readFileSync(fullPath, Encoding.UTF_8)
  try {
    return JSON.parse(jsonString) as PackageJson
  } catch (e) {
    console.log(chalk.red(`Encountered malformed JSON in "${fullPath}"`))
    throw e
  }
}
