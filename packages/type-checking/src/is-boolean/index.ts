/**
 * Determine if a value is a boolean.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a boolean.
 * @public
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}
