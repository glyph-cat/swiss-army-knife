import { JSFunction } from '../../../../types'
import { EMPTY_OBJECT } from '../../../dummies'

/**
 * Loops through each child in an object.
 * @param collection - The object to loop through.
 * @param callback - A function that receives the key and value of each item in
 * the object, then returns a (derived) value, where the values returned in each
 * iteration are aggregated into an array. To exclude an item from being
 * aggregated into the array, akin to `continue` statement, simply return the
 * `EMPTY_OBJECT`.
 * @returns The aggregated array.
 * @example
 * const collection = {
 *   'id1': { value: 1 },
 *   'id2': { value: 2 },
 *   'id3': { value: 3 },
 *   'id4': { value: 4 },
 *   'id5': { value: 5 },
 * }
 * const output = forEachChildToArray(collection, (key, child, breakLoop) => {
 *   if (child.value === 2) {
 *     return EMPTY_OBJECT
 *   } else {
 *     if (child.value === 4) { breakLoop() }
 *     return { id: key, value: child.value }
 *   }
 * })
 * @public
 */
export function forEachChildToArray<T, K>(
  collection: T,
  callback: (
    /**
     * Key of the current child.
     */
    key: keyof T,
    /**
     * Value of the current child.
     */
    child: T[keyof T],
    /**
     * Invoke this function to break the loop.
     */
    breakLoop: JSFunction
  ) => K
): Array<K> {
  const payload = []
  const keyStack = Object.keys(collection) as Array<keyof T>
  let shouldBreakLoop = false
  const breakLoop = (): void => { shouldBreakLoop = true }
  for (const key of keyStack) {
    const value = callback(key, collection[key], breakLoop)
    if (!Object.is(value, EMPTY_OBJECT)) {
      payload.push(value)
    }
    if (shouldBreakLoop) { break }
  }
  return payload
}
