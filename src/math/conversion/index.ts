const CONVERSION_FACTOR_DEG_TO_RAD = Math.PI / 180
const CONVERSION_FACTOR_RAD_TO_DEG = 180 / Math.PI

/**
 * Converts degrees to radians.
 * @param value - The value in degree.
 * @returns The value in radians.
 * @public
 */
export function degToRad(value: number): number {
  return value * CONVERSION_FACTOR_DEG_TO_RAD
}

/**
 * Converts radians to degrees.
 * @param value - The value in radians.
 * @returns The value in degree.
 * @public
 */
export function radToDeg(value: number): number {
  return value * CONVERSION_FACTOR_RAD_TO_DEG
}
