/**
 * Determine if a value is undefined.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is undefined.
 * @public
 */
export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined'
}
