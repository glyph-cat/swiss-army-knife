/**
 * Calculates the percentage based on the given values.
 * @param value - The current value.
 * @param minValue - The minimum possible value.
 * @param maxValue - The maximum possible value.
 * @returns A number between `0` to `1` representing the percentage.
 * @public
 */
export function getPercentage(
  value: number,
  minValue: number,
  maxValue: number,
): number {
  return (value - minValue) / (maxValue - minValue)
}
