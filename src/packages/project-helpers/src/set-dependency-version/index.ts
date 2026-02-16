import { hasProperty } from '@glyph-cat/swiss-army-knife'
import { PackageJson } from 'type-fest'

export function setDependencyVersion(
  packageJson: PackageJson,
  dependencyName: string,
  version: string,
): PackageJson {

  const addVersionIfMentioned = (
    propertyKey: 'dependencies' | 'devDependencies' | 'peerDependencies'
  ) => (hasProperty(packageJson, dependencyName) ? {
    [propertyKey]: {
      ...packageJson[propertyKey] as object,
      [dependencyName]: version,
    },
  } : {})

  return {
    ...packageJson,
    ...addVersionIfMentioned('dependencies'),
    ...addVersionIfMentioned('devDependencies'),
    ...addVersionIfMentioned('peerDependencies'),
  } as PackageJson

}
