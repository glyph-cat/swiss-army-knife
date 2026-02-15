import { PackageJson } from 'type-fest'

export function setDependencyVersion(
  packageObj: PackageJson,
  dependencyName: string,
  version: string,
): void {
  // TODO: Find: dependencies | devDependencies | peerDependencies
  // If specified, update the version
}
