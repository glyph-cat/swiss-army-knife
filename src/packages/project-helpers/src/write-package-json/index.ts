import { Encoding } from '@glyph-cat/foundation'
import { writeFileSync } from 'fs'
import { PackageJson } from 'type-fest'

/**
 * @public
 */
export function writePackageJson(toPath: string, object: PackageJson): void {
  writeFileSync(toPath, JSON.stringify(object, null, 2), Encoding.UTF_8)
}
