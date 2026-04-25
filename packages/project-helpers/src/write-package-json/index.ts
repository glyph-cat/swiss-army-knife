import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { PackageJson } from 'type-fest'
import { Encoding } from '../../../foundation/src/encoding'
import { PACKAGE_JSON } from '../constants'

/**
 * @public
 */
export function writePackageJson(toPath: string, object: PackageJson): void {
  writeFileSync(
    toPath.endsWith(PACKAGE_JSON) ? toPath : path.join(toPath, PACKAGE_JSON),
    JSON.stringify(object, null, 2),
    Encoding.UTF_8,
  )
}
