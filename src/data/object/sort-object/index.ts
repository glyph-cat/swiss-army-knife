import { StrictPropertyKey } from '../../../types'

/**
 * Sort an object by it's key or value.
 * @param object - The object to be sorted.
 * @param compareFn - The comparison callback.
 * @returns A new object instance with the key/values sorted. The original
 * object remains untouched.
 * @example
 * const oldObj = { foo: 123, bar: 456 }
 * const newObj = sortObject(oldObj, (a, b) => {
 *   if (a.key !== b.key) {
 *     // Will compare 'foo' with 'bar'
 *     return a.key < b.key ? -1 : 1
 *   } else {
 *     // Will compare 123 with 456
 *     return a.value < b.value ? -1 : 1
 *   }
 * })
 */
export function sortObject<O extends Record<StrictPropertyKey, unknown>>(
  object: O,
  compareFn: (
    a: { key: keyof O, value: O[keyof O] },
    b: { key: keyof O, value: O[keyof O] }
  ) => number
): O {
  const objectKeys: Array<keyof O> = Object.keys(object)
  objectKeys.sort((a, b) => {
    return compareFn(
      { key: a, value: object[a] },
      { key: b, value: object[b] }
    )
  })
  const newObj = {} as O
  for (const key of objectKeys) {
    newObj[key] = object[key]
  }
  return newObj
}
