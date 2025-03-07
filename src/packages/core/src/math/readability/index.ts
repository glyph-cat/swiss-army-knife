/**
 * Checks if a value equals to `0`.
 * @param value - The value to check.
 * @returns `true` if the value is equal to `0`.
 * @public
 */
export function isZero(value: number): value is 0 {
  return value === 0
}

/**
 * Checks if a value is negative.
 * @param value - The value to check.
 * @returns `true` if the value is negative.
 * @public
 */
export function isNegative(value: number): boolean {
  return value < 0
}

/**
 * Checks if a value is equal to `0` or negative.
 * @param value - The value to check.
 * @returns `true` if the value is equal to `0` or negative.
 * @public
 */
export function isZeroOrNegative(value: number): boolean {
  return value <= 0
}

/**
 * Checks if a value is positive.
 * @param value - The value to check.
 * @returns `true` if the value is positive.
 * @public
 */
export function isPositive(value: number): boolean {
  return value > 0
}

/**
 * Checks if a value is equal to `0` or positive.
 * @param value - The value to check.
 * @returns `true` if the value is equal to `0` or positive.
 * @public
 */
export function isZeroOrPositive(value: number): boolean {
  return value >= 0
}
