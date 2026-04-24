import { isNull } from '../is-null'
import { isUndefined } from '../is-undefined'

/**
 * Shorthand for `isUndefined(value) || isNull(value)`.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is undefined or null.
 * @public
 */
export function isUndefinedOrNull(value: unknown): value is null | undefined {
  return isUndefined(value) || isNull(value)
}
