import { PackageJson } from 'type-fest'

/**
 * @public
 */
export function setPackageVersion(
  packageObj: PackageJson,
  version: string,
): void {
  packageObj.version = version
}
