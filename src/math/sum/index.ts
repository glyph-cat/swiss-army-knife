/**
 * Get the sum of the provided numbers.
 * @param numbers - The numbers to add.
 * @returns The sum of all numbers.
 * @example
 * sum(1, 2, 3, 4, 5) // 15
 * @public
 */
export function sum(...numbers: Array<number>): number {
  let sumValue = 0
  for (let i = 0; i < numbers.length; i++) {
    sumValue += numbers[i]
  }
  return sumValue
}
