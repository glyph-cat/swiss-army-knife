/**
 * Rounds a number to the specified decimal places.
 * @param value - The number to round.
 * @param decimalPlaces - Decimal places to round. Defaults to `0`.
 * @returns The rounded number.
 * @public
 */
export function round(value: number, decimalPlaces = 0): number {
  return parseFloat(value.toFixed(decimalPlaces))
}
