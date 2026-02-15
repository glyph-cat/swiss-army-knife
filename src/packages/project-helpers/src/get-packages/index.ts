import { StringRecord } from '@glyph-cat/foundation'
import { readdirSync } from 'fs'
import path from 'path'
import { readPackageJson } from '../read-package-json'

/**
 * @public
 */
export interface GetPackagesOptions {
  excludePrivatePackages?: boolean
}

/**
 * Finds all packages in a directory. The search is only one-level deep.
 * This is done by checking sub-directories for the `package.json` file.
 * @returns An object where the key represents the directory name and the value
 * represents the package's name (obtained from `package.json`).
 * @public
 */
export function getPackages(
  directoryPath: string,
  options?: GetPackagesOptions,
): StringRecord<string> {
  const PATTERN_CONTAINS_DOT = /\./
  return readdirSync(directoryPath).filter((item) => {
    return !PATTERN_CONTAINS_DOT.test(item)
  }).reduce((acc, packageDirectory) => {
    const packageObject = readPackageJson(path.join(directoryPath, packageDirectory))
    if (!packageObject.name) {
      return acc // Early exit
    }
    if (options?.excludePrivatePackages && packageObject.private === true) {
      return acc // Early exit
    }
    acc[packageDirectory] = packageObject.name
    return acc
  }, {} as StringRecord<string>)
}
