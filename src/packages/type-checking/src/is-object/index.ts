import { PlainRecord } from '@glyph-cat/foundation'
import { isNull } from '../is-null'

/**
 * Determine if a value is an object (and not `null`, even though `null` is also
 * treated as an object in JavaScript).
 *
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is an object (and not `null`).
 * @public
 */
export function isObject(value: unknown): value is PlainRecord {
  return typeof value === 'object' && !isNull(value)
}
