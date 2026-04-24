import { isNaN } from '../is-nan'

/**
 * Determine if a value is a number.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a number.
 * @public
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}
