/**
 * Checks if a value is within a given range.
 *
 * This is a shorthand of `value >= minimumValue && value <= maximumValue`
 * @param value - The value to check
 * @param minimumValue - The minimum value to be considered in range
 * @param maximumValue - The maximum value to be considered in range
 * @returns `true` if the value is in range, otherwise `false`
 * @public
 */
export function isInRange(
  value: number,
  minimumValue: number,
  maximumValue: number,
): boolean

/**
 * Checks if a value is within a given range.
 *
 * This is a shorthand of `value >= minimumValue && value <= maximumValue`
 * @param value - The value to check
 * @param minimumValue - The minimum value to be considered in range
 * @param maximumValue - The maximum value to be considered in range
 * @returns `true` if the value is in range, otherwise `false`
 * @public
 */
export function isInRange(
  value: string,
  minimumValue: string,
  maximumValue: string,
): boolean

/**
 * Checks if a value is within a given range.
 *
 * This is a shorthand of `value >= minimumValue && value <= maximumValue`
 * @param value - The value to check
 * @param minimumValue - The minimum value to be considered in range
 * @param maximumValue - The maximum value to be considered in range
 * @returns `true` if the value is in range, otherwise `false`
 * @public
 */
export function isInRange(
  value: Date,
  minimumValue: Date,
  maximumValue: Date,
): boolean

export function isInRange(
  value: number | string | Date,
  minimumValue: number | string | Date,
  maximumValue: number | string | Date,
): boolean {
  return value >= minimumValue && value <= maximumValue
}

/**
 * Checks if a value is out of a given range.
 *
 * This is a shorthand of `value < minimumValue || value > maximumValue`
 * @param value - The value to check
 * @param minimumValue - The minimum value to be considered in range
 * @param maximumValue - The maximum value to be considered in range
 * @returns `false` if the value is in range, otherwise `true`
 * @public
 */
export function isOutOfRange(
  value: number,
  minimumValue: number,
  maximumValue: number,
): boolean

/**
 * Checks if a value is out of a given range.
 *
 * This is a shorthand of `value < minimumValue || value > maximumValue`
 * @param value - The value to check
 * @param minimumValue - The minimum value to be considered in range
 * @param maximumValue - The maximum value to be considered in range
 * @returns `false` if the value is in range, otherwise `true`
 * @public
 */
export function isOutOfRange(
  value: string,
  minimumValue: string,
  maximumValue: string,
): boolean

/**
 * Checks if a value is out of a given range.
 *
 * This is a shorthand of `value < minimumValue || value > maximumValue`
 * @param value - The value to check
 * @param minimumValue - The minimum value to be considered in range
 * @param maximumValue - The maximum value to be considered in range
 * @returns `false` if the value is in range, otherwise `true`
 * @public
 */
export function isOutOfRange(
  value: Date,
  minimumValue: Date,
  maximumValue: Date,
): boolean

export function isOutOfRange(
  value: number | string | Date,
  minimumValue: number | string | Date,
  maximumValue: number | string | Date,
): boolean {
  return value < minimumValue || value > maximumValue
}
