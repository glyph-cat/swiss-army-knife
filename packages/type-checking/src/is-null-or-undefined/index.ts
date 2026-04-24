import { isNull } from '../is-null'
import { isUndefined } from '../is-undefined'

/**
 * Shorthand for `isNull(value) || isUndefined(value)`.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is null or undefined.
 * @public
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value)
}
