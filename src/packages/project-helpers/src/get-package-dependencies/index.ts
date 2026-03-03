import { PackageJson } from 'type-fest'

/**
 * @public
 */
export interface GetPackageDependenciesOptions {
  excludeDependencies?: boolean
  excludeDevDependencies?: boolean
  excludePeerDependencies?: boolean
}

/**
 * - Key = package name
 * - Value = version
 * @public
 */
export function getPackageDependencies(
  pkg: PackageJson,
  options?: GetPackageDependenciesOptions,
): Record<string, string> {
  return {
    ...(!options?.excludeDependencies && pkg.dependencies) as Record<string, string>,
    ...(!options?.excludeDevDependencies && pkg.devDependencies) as Record<string, string>,
    ...(!options?.excludePeerDependencies && pkg.peerDependencies) as Record<string, string>,
  }
}
