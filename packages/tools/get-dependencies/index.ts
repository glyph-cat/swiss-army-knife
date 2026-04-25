import { getPackageDependencies } from '@glyph-cat/project-helpers/src/get-package-dependencies'
import { readPackageJson } from '@glyph-cat/project-helpers/src/read-package-json'
import { PROJECT_ROOT_DIRECTORY } from '../constants'
import { getSiblingPackages } from '../get-sibling-packages'

/**
 * @deprecated This is a temporary solution. Sub-packages should specify their
 * dependencies explicitly and build configs should be based on them instead of
 * the root.
 */
export function getDependenciesFromRoot(): Array<string> {
  return [
    ...getSiblingPackages().map((_, packageData) => packageData.name!),
    ...Object.keys(getPackageDependencies(readPackageJson(PROJECT_ROOT_DIRECTORY))),
  ]
}
