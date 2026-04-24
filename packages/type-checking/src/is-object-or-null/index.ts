import { PlainRecord } from '@glyph-cat/foundation'

/**
 * Determine if a value is an object or `null` (because `null` is also
 * treated as an object in JavaScript).
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is an object or `null`.
 * @public
 */
export function isObjectOrNull(value: unknown): value is PlainRecord | null {
  return typeof value === 'object'
}
