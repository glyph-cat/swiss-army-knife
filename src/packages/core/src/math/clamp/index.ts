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
  upperBound: number,
): number {
  return Math.min(Math.max(lowerBound, value), upperBound)
}
