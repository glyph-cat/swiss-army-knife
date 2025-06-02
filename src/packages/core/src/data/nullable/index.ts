import { isUndefined } from '../type-check'

/**
 * Use this to explicitly mark variables as nullable when `strictNullChecks` is
 * set to `true` in the `tsconfig.json` file.
 * @public
 */
export type Nullable<T> = T | null

/**
 * Converts a value to `null` if it is undefined.
 * @param value - The value to check/convert.
 * @returns `null` if undefined, otherwise the original value.
 * @public
 */
export function Nullable<T>(value: T): Nullable<T> {
  return isUndefined(value) ? null : value
}
