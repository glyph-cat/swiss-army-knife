/**
 * Determine if a value is a bigint.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a bigint.
 * @public
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}
