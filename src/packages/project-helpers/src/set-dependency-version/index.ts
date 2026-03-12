import { PackageJson } from 'type-fest'
import { hasProperty } from '../../../core/src/data/object'

export function setDependencyVersion(
  packageJson: PackageJson,
  dependencyName: string,
  version: string,
): PackageJson {

  if (hasProperty(packageJson.dependencies, dependencyName)) {
    packageJson.dependencies[dependencyName] = version
  }
  if (hasProperty(packageJson.devDependencies, dependencyName)) {
    packageJson.devDependencies[dependencyName] = version
  }
  if (hasProperty(packageJson.peerDependencies, dependencyName)) {
    packageJson.peerDependencies[dependencyName] = version
  }

  return packageJson

}
