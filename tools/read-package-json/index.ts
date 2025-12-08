import { readFileSync } from 'fs'
import Path from 'path'
import { PackageJson } from 'type-fest'
import { Encoding } from '../../src/packages/foundation/src/encoding'

export function readPackageJson(path: string): PackageJson {
  return JSON.parse(readFileSync(
    Path.join(path, 'package.json'),
    Encoding.UTF_8,
  )) as PackageJson
}
