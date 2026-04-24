/**
 * Determine if a value is null.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is null.
 * @public
 */
export function isNull(value: unknown): value is null {
  return Object.is(value, null)
}
