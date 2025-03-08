export function dependencyDiff(current: IPackageLike, incoming: IPackageLike): Array<string> {
  const currentDependencies = getDependenciesAsSet(current)
  const incomingDependencies = getDependenciesAsArray(incoming)
  const missingDependencies = incomingDependencies.filter((dep) => {
    return !currentDependencies.has(dep)
  })
  return missingDependencies
}

interface IPackageLike {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

function getDependenciesAsSet(pkg: IPackageLike): Set<string> {
  return new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ])
}

function getDependenciesAsArray(pkg: IPackageLike): Array<string> {
  return [...getDependenciesAsSet(pkg)].sort()
}

// const current = require('../../../package.json')
// const incoming = require('../../../src/packages/.../package.json')
// console.log(dependencyDiff(current, incoming))
