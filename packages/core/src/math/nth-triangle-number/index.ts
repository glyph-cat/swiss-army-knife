/**
 * Calculates the sum of all numbers from `1` to `n`.
 *
 * (Example: `1` + `2` + ... + `n`)
 * @param n - The number to sum to.
 * @example
 * // firstNumber      lastNumber
 * //     ┌┴┐             ┌┴┐
 * //      1 + 2 + 3 + 4 + 5
 * getNthTriangularNumber(5) // Output: 15
 * @returns The sum of all numbers from `1` to `n`.
 */
export function getNthTriangularNumber(n: number): number

/**
 * Calculates the sum of all numbers between (and including) the first and last numbers.
 *
 * (Example: `3` + `4` + ... + `n`)
 * @param firstNumber - The first number of the sequence.
 * @param lastNumber - The last number of the sequence.
 * @example
 * // firstNumber  lastNumber
 * //     ┌┴┐         ┌┴┐
 * //      3 + 4 + 5 + 6
 * getNthTriangularNumber(3, 6) // Output: 18
 * @returns The sum of all numbers between (and including) `firstNumber` and `lastNumber`.
 */
export function getNthTriangularNumber(firstNumber: number, lastNumber: number): number

/**
 * @internal
 */
export function getNthTriangularNumber(...args: [number] | [number, number]): number {
  let firstNumber: number
  let lastNumber: number
  if (args.length === 1) {
    firstNumber = 1
    lastNumber = args[0]
  } else {
    firstNumber = args[0]
    lastNumber = args[1]
  }
  // Formula: (count of numbers × (first number + last number)) ÷ 2
  return ((lastNumber - firstNumber + 1) * (firstNumber + lastNumber)) / 2
  //      └─────────────┬──────────────┘
  //                  count
}

// Interesting fact: this refactored version runs almost 10x slower
// NOTE: `/ 2` is omitted here
// (y - x + 1) * (x + y)
// xy + y² + (-x²) + (-xy) + x + y
// xy + y² - x² - xy + x + y
// x + xy - x² - xy + y + y²
// x + xy - x² - xy    +    y + y²
// x + xy - x² - xy    +    y + y²
// x * (1 + y - x - y)    +    y + y²
// x * (1 - x)    +    y + y²
// (x - x²) + (y + y²)
// return ((firstNumber - Math.pow(firstNumber, 2)) + (lastNumber + Math.pow(lastNumber, 2))) / 2
