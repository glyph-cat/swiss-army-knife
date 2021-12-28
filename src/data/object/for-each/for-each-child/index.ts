import { JSFunction } from '../../../../types'

/**
 * Loops through each child in an object.
 * @param collection - The object to loop through.
 * @param callback - A function that receives the key and value of each item in
 * the object.
 * @example
 * const collection = {
 *   'id1': { value: 1 },
 *   'id2': { value: 2 },
 *   'id3': { value: 3 },
 *   'id4': { value: 4 },
 * }
 * const output = { concat: '', sum: 0 }
 * forEachChild(collection, (key, child, breakLoop) => {
 *   output.concat += key
 *   output.sum += child.value
 *   if (output.sum >= 6) { breakLoop() }
 * })
 * @public
 */
export function forEachChild<T>(
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
  ) => void
): void {
  const keyStack = Object.keys(collection) as Array<keyof T>
  let shouldBreakLoop = false
  const breakLoop = (): void => { shouldBreakLoop = true }
  for (const key of keyStack) {
    callback(key, collection[key], breakLoop)
    if (shouldBreakLoop) { break }
  }
}
