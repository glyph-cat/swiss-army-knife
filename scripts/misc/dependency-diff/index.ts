import { PackageJson } from 'type-fest'

export function dependencyDiff(current: PackageJson, incoming: PackageJson): Array<string> {
  const currentDependencies = getDependenciesAsSet(current)
  const incomingDependencies = getDependenciesAsArray(incoming)
  const missingDependencies = incomingDependencies.filter((dep) => {
    return !currentDependencies.has(dep)
  })
  return missingDependencies
}

function getDependenciesAsSet(pkg: PackageJson): Set<string> {
  return new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ])
}

function getDependenciesAsArray(pkg: PackageJson): Array<string> {
  return [...getDependenciesAsSet(pkg)].sort()
}

// const current = require('../../../package.json')
// const incoming = require('../../../src/packages/.../package.json')
// console.log(dependencyDiff(current, incoming))
