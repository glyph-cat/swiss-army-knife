import { JSFunction } from '../../../../types'
import { isFunction } from '../../../../data/type-check'
import { EMPTY_OBJECT } from '../../../dummies'

/**
 * Loops through each child in an object.
 * @param collection - The object to loop through.
 * @param callback - A function that receives the key and value of each item in
 * the object, then returns a (derived) value, where the values returned in each
 * iteration are aggregated into a new object. To exclude an item from being
 * aggregated into the object, akin to `continue` statement, simply return the
 * `EMPTY_OBJECT`.
 * @returns The aggregated object.
 * @example
 * const collection = {
 *   'id1': { value: 1 },
 *   'id2': { value: 2 },
 *   'id3': { value: 3 },
 *   'id4': { value: 4 },
 *   'id5': { value: 5 },
 * }
 * const output = forEachChildToObject(collection, (key, child, breakLoop) => {
 *   if (child.value === 2) {
 *     return EMPTY_OBJECT
 *   } else {
 *     if (child.value === 4) { breakLoop() }
 *     return { value: child.value * 2 }
 *   }
 * }, (key) => key.replace('id', ''))
 * @public
 */
export function forEachChildToObject<T, K>(
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
  ) => K,
  keyMapper?: (
    /**
     * Key of the current child.
     */
    key: keyof T,
    /**
     * Value of the current child.
     */
    child: T[keyof T],
  ) => string,
): Record<string, K> {
  const payload = {} as Record<string, K>
  const keyStack = Object.keys(collection) as Array<keyof T>
  let shouldBreakLoop = false
  const breakLoop = (): void => { shouldBreakLoop = true }
  for (const key of keyStack) {
    const newKey = isFunction(keyMapper)
      ? keyMapper(key, collection[key])
      : key as string
    const value = callback(key, collection[key], breakLoop)
    if (!Object.is(value, EMPTY_OBJECT)) {
      payload[newKey] = value
    }
    if (shouldBreakLoop) { break }
  }
  return payload
}
