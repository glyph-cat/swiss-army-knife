import { StringRecord } from '@glyph-cat/foundation'
import { readdirSync } from 'fs'
import path from 'path'
import { PackageJson } from 'type-fest'
import { PACKAGE_JSON } from '../constants'
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
 * @returns An object where the:
 * - key = directory name
 * - value = contents of `package.json`
 * @public
 */
export function getPackages(
  directoryPath: string,
  options?: GetPackagesOptions,
): GetPackagesResult {
  const PATTERN_CONTAINS_DOT = /\./
  const data = readdirSync(directoryPath).filter((item) => {
    return !PATTERN_CONTAINS_DOT.test(item)
  }).reduce((acc, packageDirectory) => {
    const packageObject = readPackageJson(path.join(directoryPath, packageDirectory))
    if (options?.excludePrivatePackages && packageObject.private === true) {
      return acc // Early exit
    }
    acc[packageDirectory] = packageObject
    return acc
  }, {} as StringRecord<PackageJson>)
  return new GetPackagesResult(data)
}

/**
 * @public
 */
export class GetPackagesResult {

  /**
   * @internal
   */
  private readonly M$nameToDirMapping: StringRecord<string> = {}

  readonly data: StringRecord<PackageJson>

  /**
   * @internal
   */
  constructor(data: StringRecord<PackageJson>) {
    this.data = data
    for (const packageDir in data) {
      this.data[packageDir] = Object.freeze(this.data[packageDir])
      const packageJson = data[packageDir]
      if (!packageJson.name) {
        throw new Error(`The \`name\` property is missing from "${path.join(packageDir, PACKAGE_JSON)}"`)
      }
      this.M$nameToDirMapping[packageJson.name] = packageDir
    }
    this.data = Object.freeze(this.data)
  }

  hasDir(directoryName: string): boolean {
    return !!this.data[directoryName]
  }

  getByDir(directoryName: string): PackageJson {
    const packageJson = this.data[directoryName]
    if (!packageJson) {
      throw new Error(`Directory "${packageJson}" does not exist`)
    }
    return packageJson
  }

  hasPackage(packageName: string): boolean {
    return !!this.M$nameToDirMapping[packageName]
  }

  getByName(packageName: string): PackageJson {
    const dir = this.M$nameToDirMapping[packageName]
    if (!dir) {
      throw new Error(`Package "${dir}" does not exist`)
    }
    return this.getByDir(dir)
  }

  forEach(
    callbackFn: (
      packageDirectory: string,
      packageData: PackageJson,
      index: number,
    ) => void,
  ): void {
    let index = 0
    for (const dirName in this.data) {
      callbackFn(dirName, this.data[dirName], index++)
    }
  }

  map<T>(
    callbackFn: (
      packageDirectory: string,
      packageData: PackageJson,
      index: number,
    ) => T,
  ): Array<T> {
    let index = 0
    const mappedData: Array<T> = []
    for (const dirName in this.data) {
      callbackFn(dirName, this.data[dirName], index++)
    }
    return mappedData
  }

  filter(
    predicate: (
      packageDirectory: string,
      packageData: PackageJson,
      index: number,
    ) => boolean,
  ): GetPackagesResult {
    let index = 0
    const newData: typeof this.data = {}
    for (const dirName in this.data) {
      if (predicate(dirName, this.data[dirName], index++)) {
        newData[dirName] = this.data[dirName]
      }
    }
    return new GetPackagesResult(newData)
  }

  reduce<U>(
    callbackfn: (
      accumulator: U,
      packageDirectory: string,
      packageData: PackageJson,
      index: number,
    ) => U,
    accumulator: U,
  ): U {
    let index = 0
    for (const dirName in this.data) {
      callbackfn(accumulator, dirName, this.data[dirName], index++)
    }
    return accumulator
  }

}
