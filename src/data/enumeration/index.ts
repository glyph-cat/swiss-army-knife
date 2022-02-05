import { GCObject } from '../../bases'
import { JSObjectKeyStrict } from '../../types'
import { forEachChild } from '../object/for-each'
import { hasProperty } from '../object/has-property'

/**
 * @public
 */
export type Enumeration<K extends JSObjectKeyStrict, V extends JSObjectKeyStrict> = Record<K | V, V | K>

/**
 * Creates an enumaration from an object that is similar to TypeScript's `enum`.
 * @param entries - The object to enumerate.
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
): Enumeration<K, V> {
  const enumeration = {}
  forEachChild(entries, (key: JSObjectKeyStrict, value: JSObjectKeyStrict) => {
    enumeration[key] = value
    enumeration[value] = key
  })
  Object.freeze(enumeration)
  return enumeration as Enumeration<K, V>
}

/**
 * Creates an enumaration from an object that is similar to TypeScript's `enum`,
 * but with additional flexibility of mutating the values.
 * @public
 */
export class MutableEnumeration<K extends JSObjectKeyStrict, V extends JSObjectKeyStrict> extends GCObject {

  /**
   * Underlying data of the enumeration.
   */
  private M$enumeration: Enumeration<K, V> = ({} as Enumeration<K, V>)

  /**
   * @param entries - The object to enumerate.
   * @example
   * let myMutableEnum = new MutableEnumeration({
   *   a: 1,
   *   b: 2,
   * })
   */
  constructor(entries: Record<K, V> = ({} as Record<K, V>)) {
    super()
    forEachChild(entries, (key: JSObjectKeyStrict, value: JSObjectKeyStrict) => {
      this.M$enumeration[key] = value
      this.M$enumeration[value] = key
    })
  }

  /**
   * Inserts a new item into the enumeration.
   * @param key - Key of the new item.
   * @param value - Value of the new item.
   * @example
   * myMutableEnum = myMutableEnum.add('c', 3)
   * @returns A new `MutableEnumeration` instance. The original instance remains
   * unaffected.
   */
  add(
    key: JSObjectKeyStrict,
    value: JSObjectKeyStrict
  ): MutableEnumeration<K, V> {
    const newMutableEnumeration = this.clone()
    newMutableEnumeration.M$enumeration[key] = value
    newMutableEnumeration.M$enumeration[value] = key
    return newMutableEnumeration
  }

  /**
   * Removes an item from the enumeration.
   * @param keyOrValue - The key or value to remove. Either way, both the key
   * and the value will be removed.
   * removed
   * @example myMutableEnum = myMutableEnum.remove('a') // Remove by key
   * @example myMutableEnum = myMutableEnum.remove(1)   // Remove by value
   * @returns A new `MutableEnumeration` instance. The original instance remains
   * unaffected.
   */
  remove(keyOrValue: JSObjectKeyStrict): MutableEnumeration<K, V> {
    const newMutableEnumeration = this.clone()
    const theOtherKeyOrValue = newMutableEnumeration.M$enumeration[keyOrValue]
    delete newMutableEnumeration.M$enumeration[keyOrValue]
    delete newMutableEnumeration.M$enumeration[theOtherKeyOrValue]
    return newMutableEnumeration
  }

  /**
   * Get the value of an item by key.
   * @param key - Key of the item.
   * @returns The value.
   * @example
   * myMutableEnum.get('a') // 1
   */
  get(key: K): V

  /**
   * Get the key of an item by value.
   * @param value - Value of the item.
   * @returns The key.
   * @example
   * myMutableEnum.get(1) // 'a'
   */
  get(value: V): K

  get(keyOrValue: JSObjectKeyStrict): K | V {
    return this.M$enumeration[keyOrValue] as K | V
  }

  /**
   * Get the entire enumeration as a JavaScript object.
   * @example
   * myMutableEnum.toJSON()
   * @returns The enumeration as a JavaScript object.
   */
  toJSON(): Enumeration<K, V> {
    return { ...this.M$enumeration }
  }

  /**
   * Check if a key or value exists in the enumeration.
   * @param keyOrValue - Key of value to check.
   * @returns A boolean indicating whether the key or value exists.
   * @example
   * myMutableEnum.has('a') // Check by key
   * @example
   * myMutableEnum.has(1)   // Check by value
   */
  has(keyOrValue: JSObjectKeyStrict): boolean {
    return hasProperty(this.M$enumeration, keyOrValue)
  }

  /**
   * Deep clones the current MutableEnumeration.
   * @example
   * const clonedMutableEnum = myMutableEnum.clone()
   * @returns A new `MutableEnumeration` instance. The original instance remains
   * unaffected.
   */
  clone(): MutableEnumeration<K, V> {
    const newMutableEnumeration = new MutableEnumeration<K, V>()
    newMutableEnumeration.M$enumeration = this.toJSON()
    return newMutableEnumeration
  }

}
