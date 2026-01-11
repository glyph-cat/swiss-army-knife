import { isFunction } from '../../type-check'

/**
 * @public
 */
export interface ISleepSort {
  <T>(
    /**
     * The array to sort.
     */
    array: Array<T>,
    /**
     * A function that derives a numeric value from each item in the array.
     * (Note: smaller value = closer to start of list)
     */
    extractor?: (item: T) => number,
  ): Array<T>
}

/**
 * ## 🚧 WARNING: For educational purposes only 🚧
 * Sorts an array using "sleep sort".
 * In reality, this is a bad practice. For reference, here's an article that
 * explains the algorithm and breaks down the downside of using it:
 * https://dev.to/sishaarrao/sleep-sort-where-theory-meets-sobering-reality-b3m.
 * Also note that this function requires
 * [`@sinonjs/fake-timers`](https://www.npmjs.com/package/@sinonjs/fake-timers)
 * to be installed.
 * @example
 * // Simple:
 * export const sleepSort = createSleepSorter()
 *
 * const sortedArray = sleepSort([3, 1, 4, 2])
 * console.log(sortedArray) // [1, 2, 3, 4]
 * @example
 * // With extractor:
 * export const sleepSort = createSleepSorter()
 *
 * const extractor = (item) => String.prototype.charCodeAt.call(item, 0)
 * const sortedArray = sleepSort(['C', 'A', 'D', 'B'], extractor)
 * console.log(sortedArray) // ['A', 'B', 'C', 'D']
 * @public
 */
export function createSleepSorter(): ISleepSort {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClock } = require('@sinonjs/fake-timers')
  const sleepSort: ISleepSort = <T>(
    array: Array<T>,
    extractor?: (item: T) => number
  ): Array<T> => {
    const clock = createClock()
    const sortedArray = array.reduce((acc, item) => {
      const numericValue = isFunction(extractor)
        ? extractor(item)
        : item as number
      clock.setTimeout(() => { acc.push(item) }, numericValue)
      return acc
    }, [] as Array<T>)
    clock.runAll()
    return sortedArray
  }
  return sleepSort
}
