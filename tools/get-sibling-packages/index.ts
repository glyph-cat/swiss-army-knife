import { readdirSync } from 'fs'
import Path from 'path'
import { pickLast } from '../../src/packages/core/src/data/array/pick-last'
import { StringRecord } from '../../src/packages/foundation/src/records'
import { readPackageJson } from '../read-package-json'

export function getSiblingPackages(): StringRecord<string> {

  const cwd = process.cwd()
  const cwdChunks = cwd.split(Path.sep).filter((chunk) => !!chunk)

  while (
    pickLast(cwdChunks, -1) !== '@glyph-cat' &&
    pickLast(cwdChunks) !== 'swiss-army-knife'
  ) {
    cwdChunks.pop()
    if (cwdChunks.length <= 1) {
      throw new Error('Unable to resolve project directory')
    }
  }

  const PATTERN_CONTAINS_DOT = /\./
  const packagesDirectory = (Path.sep === '/' ? '/' : '') + Path.join(...cwdChunks, 'src', 'packages')

  return readdirSync(packagesDirectory).filter((item) => {
    return !PATTERN_CONTAINS_DOT.test(item)
  }).reduce((acc, packageName) => {
    const packageObject = readPackageJson(Path.join(packagesDirectory, packageName))
    if (packageObject.private !== true) {
      acc[packageName] = packageObject.name
    }
    return acc
  }, {} as StringRecord<string>)

}
