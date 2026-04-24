const CONVERSION_FACTOR = 2.54

/**
 * Converts centimeters to inches.
 * @param value - The value in centimeters.
 * @returns The value in inches.
 * @public
 */
export function cmToInches(value: number): number {
  return value / CONVERSION_FACTOR
}

/**
 * Converts inches to centimeters.
 * @param value - The value in inches.
 * @returns The value in centimeters.
 * @public
 */
export function inchesToCm(value: number): number {
  return value * CONVERSION_FACTOR
}
