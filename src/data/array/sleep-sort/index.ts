import { createClock } from '@sinonjs/fake-timers'
import { isFunction } from '../../type-check'

/**
 * ## 🚧 WARNING: NOT RELIABLE 🚧
 * Sorts an array using 'sleep sort'. Please make a search online on why sleep
 * sort is bad. Here's one article in case you don't have the luxury of time to
 * search and sift through the results: https://dev.to/sishaarrao/sleep-sort-where-theory-meets-sobering-reality-b3m.
 * @param array - The array to sort.
 * @param extractor - A function that derives a numeric value from each item in
 * the array. (Note: smaller value = closer to start of list)
 * @returns The sorted array.
 * @example
 * const sortedArray = sleepSort([3, 1, 4, 2])
 * console.log(sortedArray) // [1, 2, 3, 4]
 * @example
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
  const sortedArray: Array<T> = []
  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    const numericValue = isFunction(extractor)
      ? extractor(item)
      : item as unknown as number
    const paddedNumericValue = numericValue * 20
    // ^ Because a difference of 1ms can be risky
    clock.setTimeout(() => {
      sortedArray.push(item)
    }, paddedNumericValue)
  }
  clock.runAll()
  return sortedArray
}
