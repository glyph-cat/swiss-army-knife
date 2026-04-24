/**
 * Calculates the percentage based on a range.
 * @param value - The current value.
 * @param minValue - The minimum possible value.
 * @param maxValue - The maximum possible value.
 * @returns A number between `0` to `1` representing the percentage.
 * @example
 * getPercentage(50, 0, 100) // 0.5 (50%)
 * getPercentage(0, -100, 100) // 0.5 (50%)
 * @public
 */
export function getPercentage(
  value: number,
  minValue: number,
  maxValue: number,
): number {
  return (value - minValue) / (maxValue - minValue)
}
