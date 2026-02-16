import { hasProperty } from '@glyph-cat/swiss-army-knife'
import { PackageJson } from 'type-fest'

export function setDependencyVersion(
  packageJson: PackageJson,
  dependencyName: string,
  version: string,
): PackageJson {

  // const addVersionIfMentioned = (
  //   propertyKey: 'dependencies' | 'devDependencies' | 'peerDependencies'
  // ) => (hasProperty(packageJson[propertyKey], dependencyName) ? {
  //   [propertyKey]: {
  //     ...packageJson[propertyKey] as object,
  //     [dependencyName]: version,
  //   },
  // } : {})

  // return {
  //   ...packageJson,
  //   ...addVersionIfMentioned('dependencies'),
  //   ...addVersionIfMentioned('devDependencies'),
  //   ...addVersionIfMentioned('peerDependencies'),
  // } as PackageJson

  console.log('packageJson', packageJson, 'dependencyName', dependencyName)
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
