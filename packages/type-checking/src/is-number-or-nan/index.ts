/**
 * Determine if a value is a number or `NaN`.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a number or `NaN`.
 * @public
 */
export function isNumberOrNaN(value: unknown): value is number {
  return typeof value === 'number'
}
