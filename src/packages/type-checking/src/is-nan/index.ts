/**
 * Determine if a value is `NaN`.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is `NaN`.
 * @public
 */
export function isNaN(value: unknown): value is typeof NaN {
  return Object.is(value, NaN)
}
