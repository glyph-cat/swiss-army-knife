import { Empty } from '@glyph-cat/foundation'
import { PackageJson } from 'type-fest'

/**
 * @public
 */
export interface GetPackageDependenciesOptions {
  excludeDependencies?: boolean
  excludeDevDependencies?: boolean
  excludePeerDependencies?: boolean
  excludePeerDependenciesMeta?: boolean
  excludeBundleDependencies?: boolean
  excludeBundledDependencies?: boolean
  excludeOptionalDependencies?: boolean
}

/**
 * @public
 */
export function getPackageDependencies(
  pkg: PackageJson,
  options?: GetPackageDependenciesOptions,
): Array<string> {
  return [...new Set([
    ...(options?.excludePeerDependencies
      ? Empty.ARRAY
      : Object.keys(pkg.dependencies ?? Empty.OBJECT)),
    ...(options?.excludeDevDependencies
      ? Empty.ARRAY
      : Object.keys(pkg.devDependencies ?? Empty.OBJECT)),
    ...(options?.excludePeerDependencies
      ? Empty.ARRAY
      : Object.keys(pkg.peerDependencies ?? Empty.OBJECT)),
    ...(options?.excludePeerDependenciesMeta
      ? Empty.ARRAY
      : Object.keys(pkg.peerDependenciesMeta ?? Empty.OBJECT)),
    ...(options?.excludeBundleDependencies
      ? Empty.ARRAY
      : Object.keys(pkg.bundleDependencies ?? Empty.OBJECT)),
    ...(options?.excludeBundledDependencies
      ? Empty.ARRAY
      : Object.keys(pkg.bundledDependencies ?? Empty.OBJECT)),
    ...(options?.excludeOptionalDependencies
      ? Empty.ARRAY
      : Object.keys(pkg.optionalDependencies ?? Empty.OBJECT)),
  ])].sort()
}
