/**
 * Add new items to the end of an array and removes old items from the front if
 * its length exceeds the specified limit.
 * @param maxSize - Maximum size of array allowed.
 * @param items - The items to push.
 * @param array - The original array.
 * @returns A new array containing the new items.
 * @example
 * const array = [1, 2, 3, 4]
 * const output = clampedPush(7, [5, 6, 7, 8], array)
 * console.log(output) // [2, 3, 4, 5, 6, 7, 8]
 * @public
 */
export function clampedPush<T>(
  maxSize: number,
  items: Array<T>,
  array: Array<T>
): Array<T> {
  const newArray = [...array, ...items]
  const sizeDiff = Math.max(0, newArray.length - maxSize)
  // New items are added from tail, so old items should be remove from head.
  if (sizeDiff > 0) { newArray.splice(0, sizeDiff) }
  return newArray
}

/**
 * @public
 */
export interface ClampedUnshiftOptions {
  /**
   * @defaultValue `false`
   */
  harshJoin?: boolean
}

/**
 * Add new items to the front of an array and removes old items from the end if
 * its length exceeds the specified limit.
 * @param maxSize - Maximum size of array allowed.
 * @param items - The items to unshift.
 * @param array - The original array.
 * @returns A new array containing the new items.
 * @example
 * const array = [1, 2, 3, 4]
 * const output = clampedUnshift(7, [5, 6, 7, 8], array)
 * console.log(output) // [8, 7, 6, 5, 1, 2, 3]
 * @example
 * const array = [1, 2, 3, 4]
 * const output = clampedUnshift(7, [5, 6, 7, 8], array)
 * console.log(output) // [5, 6, 7, 8, 1, 2, 3]
 * @public
 */
export function clampedUnshift<T>(
  maxSize: number,
  items: Array<T>,
  array: Array<T>,
  options: ClampedUnshiftOptions = {}
): Array<T> {
  const newArray = options?.harshJoin
    ? [...items, ...array]
    : [...[...items].reverse(), ...array]
  const sizeDiff = Math.max(0, newArray.length - maxSize)
  // New items are added from head, so old items should be remove from tail.
  if (sizeDiff > 0) { newArray.splice(maxSize, sizeDiff) }
  return newArray
}
