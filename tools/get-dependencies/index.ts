import { PROJECT_ROOT_DIRECTORY } from '../../scripts/constants'
import { getPackageDependencies } from '../../src/packages/project-helpers/src/get-package-dependencies'
import { readPackageJson } from '../../src/packages/project-helpers/src/read-package-json'

/**
 * @deprecated This is a temporary solution. Sub-packages should specify their
 * dependencies explicitly and build configs should be based on them instead of
 * the root.
 */
export function getDependenciesFromRoot(): Array<string> {
  return getPackageDependencies(readPackageJson(PROJECT_ROOT_DIRECTORY))
}
