/**
 * Checks if a number is an even number.
 * @param value - The value to check.
 * @returns `true` if the value is an even number.
 * @public
 */
export function isEven(value: number): boolean {
  return value % 2 === 0
}

/**
 * Checks if a number is an odd number.
 * @param value - The value to check.
 * @returns `true` if the value is an odd number.
 * @public
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0
}

/**
 * Checks if a value is fully divisible by a number.
 * @param number - The number to divide by.
 * @param value - The value to check.
 * @returns `value % number === 0`
 * @public
 */
export function isDivisibleBy(number: number, value: number): boolean {
  return value % number === 0
}

/**
 * Creates a function that checks if a value is fully divisible by a number.
 * @param number - The number to divide by.
 * @returns `value % number === 0`
 * @public
 */
export function isDivisibleByN(number: number): (value: number) => boolean {
  return (value: number) => value % number === 0
}
