/**
 * Returns a new object with the key-value pairs of a source object that meet
 * the condition specified in a callback function.
 * @param object - The object to filter.
 * @param predicate - A function that accepts up to four arguments.
 * This method calls the predicate function one time for each key-value pair in the object.
 * @returns A new object with the filtered key-value pairs.
 * @public
 */
export function objectFilter<T>(
  object: T,
  predicate: (value: T[keyof T], key: keyof T, index: number, object: T) => boolean,
): Partial<T> {
  const payload: Partial<T> = {}
  let index = 0
  for (const key in object) {
    if (predicate(object[key], key, index, object)) {
      payload[key] = object[key]
    }
    index += 1
  }
  return payload
}
