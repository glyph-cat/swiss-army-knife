import { PackageJson } from 'type-fest'

export function getDependencies(pkg: PackageJson): Array<string> {
  return [...new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ])].sort()
}
