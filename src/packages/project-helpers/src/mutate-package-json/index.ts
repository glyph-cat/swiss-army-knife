import { isJSONequal } from '@glyph-cat/equality'
import { JSONclone } from '@glyph-cat/swiss-army-knife'
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
  const initialValues = JSONclone(packageJson)
  const modifiedValues = mutator(packageJson)
  if (!isJSONequal(initialValues, modifiedValues)) {
    writePackageJson(packagePath, modifiedValues)
  }
  return modifiedValues
}
