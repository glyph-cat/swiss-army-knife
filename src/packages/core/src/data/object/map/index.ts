/**
 * Calls a defined callback function on each key-value pair of an object,
 * and returns an array that contains the results.
 *
 * This is an equivalent of [Array.prototype.map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) but for objects.
 * @param object - The object to iterate.
 * @param callbackfn - A function that accepts up to four arguments. The map method calls the callbackfn function one time for each key-value pair in the object.
 * @returns The mapped results.
 * @public
 */
export function objectMap<T, K>(
  object: T,
  callbackFn: (value: T[keyof T], key: keyof T, index: number, object: T) => K,
): Array<K> {
  let index = 0
  const payload: Array<K> = []
  for (const key in object) {
    payload.push(callbackFn(object[key], key, index, object))
  }
  index += 1
  return payload
}
