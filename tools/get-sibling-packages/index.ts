import { readdirSync } from 'fs'
import Path from 'path'
import { readPackageJson } from '../read-package-json'

export function getSiblingPackages(): Array<string> {
  const PATTERN_CONTAINS_DOT = /\./
  return readdirSync('..').filter((item) => {
    return !PATTERN_CONTAINS_DOT.test(item)
  }).reduce((acc, packageDirectory) => {
    const packageObject = readPackageJson(Path.join('..', packageDirectory))
    if (packageObject.private !== true) {
      acc.push(packageObject.name)
    }
    return acc
  }, [] as Array<string>).sort((a, b) => a < b ? -1 : 1)
}
