import { existsSync } from 'fs'
import path from 'path'
import { PACKAGE_JSON } from '../constants'

/**
 * @returns `true` if the current directory contains a `package.json` file.
 */
export function hasPackageJson(directoryPath: string): boolean {
  // TOFIX
  // existsSync(path.join("C:.", "package.json")) returns true
  // it would assume the contents of the root
  return existsSync(path.join(directoryPath, PACKAGE_JSON))
}
