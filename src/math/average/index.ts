import { sum } from '../sum'

/**
 * Get the average of the provided numbers.
 * @param numbers - The numbers to average.
 * @returns The average of all specified numbers.
 * @example
 * average(1, 2, 3, 4, 5) // 3
 * @public
 */
export function average(...numbers: Array<number>): number {
  return sum(...numbers) / numbers.length
}
