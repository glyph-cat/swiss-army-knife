import { existsSync } from 'fs'
import path from 'path'
import { PACKAGE_JSON } from '../constants'

/**
 * @returns `true` if the current directory contains a `package.json` file.
 */
export function hasPackageJson(directoryPath: string): boolean {
  return existsSync(path.join(directoryPath, PACKAGE_JSON))
}
