import { hasProperty } from '@glyph-cat/swiss-army-knife'
import { PackageJson } from 'type-fest'

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
