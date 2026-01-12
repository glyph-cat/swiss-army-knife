/**
 * Determine if a value is a string.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a string.
 * @public
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}
