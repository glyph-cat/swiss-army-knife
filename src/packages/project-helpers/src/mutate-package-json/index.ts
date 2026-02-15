import { PackageJson } from 'type-fest'
import { readPackageJson } from '../read-package-json'
import { writePackageJson } from '../write-package-json'

/**
 * @param packagePath - Path to the `package.json` file.
 * @param mutator - The function to mutate the `package.json` contents.
 * @public
 */
export function mutatePackageJson(
  packagePath: string,
  mutator: (packageJson: PackageJson) => PackageJson,
): PackageJson {
  const packageJson = readPackageJson(packagePath)
  const payload = mutator(packageJson)
  writePackageJson(packagePath, payload)
  return payload
}
