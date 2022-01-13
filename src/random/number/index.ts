import { TESTSAFE_random } from '../../__internals__'

/**
 * Get random number between the lower and upper bounds, but excluding the upper
 * bound. The function is designed this way to make it easier to work with,
 * arrays, which indices start from `0` and end at `array.length - 1`.
 * @param lowerBoundInclusive - The smallest possible number.
 * @param upperBoundExclusive - The largest possible number + 1.
 * @returns A random number between the lower and upper bounds, but excluding
 * the upper bound.
 * @example
 * // Generate a random number between 0 - 9.
 * getRandomNumber(0, 10)
 * @example
 * // Generate a random number that is a valid index of the array.
 * getRandomNumber(0, array.length)
 * @public
 */
export function getRandomNumber(
  lowerBoundInclusive: number,
  upperBoundExclusive: number
  // ^ Designed this way to make it easy to use with arrays
): number {
  return lowerBoundInclusive + Math.floor(TESTSAFE_random() * upperBoundExclusive)
}
