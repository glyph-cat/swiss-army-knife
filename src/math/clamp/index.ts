/**
 * Makes sure a number stays within a given range.
 * @param value - The value to be clamped.
 * @param lowerBound - The minimum value allowed.
 * @param upperBound - The maximum value allowed.
 * @returns The clamped number.
 * @example
 * clamp(5, 0, 10)  // 5
 * clamp(-5, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 * @public
 */
export function clamp(
  value: number,
  lowerBound: number,
  upperBound: number
): number {
  return Math.min(Math.max(lowerBound, value), upperBound)
}

/**
 * Makes sure a number is at most the specified maximum value.
 * @param value - The value to be clamped.
 * @param upperBound - The maximum value allowed.
 * @returns The clamped number.
 * @example
 * withMaximumLimit(7, 5)  // 5
 * withMaximumLimit(7, 10) // 7
 * @public
 */
export function withMaximumLimit(value: number, upperBound: number): number {
  return Math.min(value, upperBound)
}

/**
 * Makes sure a number is at least the specified minimum value.
 * @param value - The value to be limited.
 * @param lowerBound - The minimum value allowed.
 * @returns The limited number.
 * @example
 * withMinimumLimit(7, 5)  // 7
 * withMinimumLimit(7, 10) // 10
 * @public
 */
export function withMinimumLimit(value: number, lowerBound: number): number {
  return Math.max(lowerBound, value)
}
