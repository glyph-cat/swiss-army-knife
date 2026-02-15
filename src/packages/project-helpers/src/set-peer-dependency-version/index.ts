import { PackageJson } from 'type-fest'

export function setPeerDependencyVersion(
  packageObj: PackageJson,
  dependencyName: string,
  version: string,
): void {
  if (!packageObj.peerDependencies) {
    packageObj.peerDependencies = {}
  }
  packageObj.peerDependencies[dependencyName] = version
}
