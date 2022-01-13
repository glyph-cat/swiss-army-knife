import { JSObjectKeyStrict } from '../../types'
import { forEachChild } from '../object/for-each'

/**
 * Creates an enumaration from an object that is similar to TypeScript's `enum`.
 * @param entries - The object
 * @returns The enumeration.
 * @example
 * const enumeration = enumerate({
 *   a: 1,
 *   b: 2,
 * })
 * console.log(enumeration)
 * // {
 * //   a: 1,
 * //   b: 2,
 * //   1: 'a',
 * //   2: 'b',
 * // }
 * @public
 */
export function enumerate<K extends JSObjectKeyStrict, V extends JSObjectKeyStrict>(
  entries: Record<K, V>
): Record<K | V, V | K> {
  const enumeration = {}
  forEachChild(entries, (key, value) => {
    enumeration[key as JSObjectKeyStrict] = value
    enumeration[value as JSObjectKeyStrict] = key
  })
  Object.freeze(enumeration)
  return enumeration as Record<K | V, V | K>
}
