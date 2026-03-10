/**
 * @public
 */
export type DivMod = [quotient: number, remainder: number]

/**
 * Given a dividend and divisor, get the quotient and remainder.
 * @param dividend - The number to be divided.
 * @param divisor - The number to divide by.
 * @returns A tuple containing the quotient and remainder of the operation.
 * @example
 * const [quotient, remainder] = divMod(9, 2)
 * // quotient  = 4
 * // remainder = 1
 * @public
 */
export function divMod(dividend: number, divisor: number): DivMod {
  return [Math.floor(dividend / divisor), dividend % divisor]
}
