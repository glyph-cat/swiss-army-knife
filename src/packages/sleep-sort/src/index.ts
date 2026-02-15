import { createClock } from '@sinonjs/fake-timers'

/**
 * ## 🚧 WARNING: For educational purposes only 🚧
 * Sorts an array using "sleep sort".
 * In reality, this is a bad practice. For reference, here's an article that
 * explains the algorithm and breaks down the downside of using it:
 * https://dev.to/sishaarrao/sleep-sort-where-theory-meets-sobering-reality-b3m.
 * This function requires
 * [`@sinonjs/fake-timers`](https://www.npmjs.com/package/@sinonjs/fake-timers)
 * to be installed.
 * @param array - The array to sort.
 * @param extractor - A function that derives a numeric value from each item in
 * the array. (Note: smaller value = closer to start of list)
 * @returns The sorted array.
 * @example
 * // Simple:
 * const sortedArray = sleepSort([3, 1, 4, 2])
 * console.log(sortedArray) // [1, 2, 3, 4]
 * @example
 * // With extractor:
 * const extractor = (item) => String.prototype.charCodeAt.call(item, 0)
 * const sortedArray = sleepSort(['C', 'A', 'D', 'B'], extractor)
 * console.log(sortedArray) // ['A', 'B', 'C', 'D']
 * @public
 */
export function sleepSort<T>(
  array: Array<T>,
  extractor?: (item: T) => number
): Array<T> {
  const clock = createClock()
  const sortedArray = array.reduce((acc, item) => {
    const numericValue = extractor ? extractor(item) : item as number
    clock.setTimeout(() => { acc.push(item) }, numericValue)
    return acc
  }, [] as Array<T>)
  clock.runAll()
  return sortedArray
}
