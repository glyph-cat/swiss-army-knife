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
 * @public
 */
export interface MutableEnumeration<K extends JSObjectKeyStrict, V extends JSObjectKeyStrict> {
  /**
   * Inserts a new item into the enumeration.
   * @param key - Key of the new item.
   * @param value - Value of the new item.
   */
  add(key: JSObjectKeyStrict, value: JSObjectKeyStrict): void
  /**
   * Removes an item from the enumeration.
   * @param keyOrValue - The key or value to remove. Either way, both the key
   * and the value will be removed.
   * removed
   */
  remove(keyOrValue: JSObjectKeyStrict): void
  /**
   * Get the value of an item by key.
   * @param key - Key of the item.
   * @returns The value.
   */
  get(key: K): V
  /**
   * Get the key of an item by value.
   * @param value - Value of the item.
   * @returns The key.
   */
  get(value: V): K
  /**
   * Get the entire enumeration as a JavaScript object.
   */
  getAll(): Enumeration<K, V>
  /**
   * Check if a key or value exists in the enumeration.
   * @param keyOrValue - Key of value to check.
   * @returns A boolean indicating whether the key or value exists.
   */
  has(keyOrValue: JSObjectKeyStrict): boolean
}

/**
 * Creates an enumaration from an object that is similar to TypeScript's `enum`,
 * but with additional flexibility of mutating the values.
 * @param entries - The object to enumerate.
 * @returns A `MutableEnumeration` instance.
 * @example
 * const enumeration = mutableEnumerate({
 *   a: 1,
 *   b: 2,
 * })
 * @public
 */
export function mutableEnumerate<K extends JSObjectKeyStrict, V extends JSObjectKeyStrict>(
  entries: Record<K, V> = ({} as Record<K, V>)
): MutableEnumeration<K, V> {
  const enumeration = {}
  forEachChild(entries, (key: JSObjectKeyStrict, value: JSObjectKeyStrict) => {
    enumeration[key] = value
    enumeration[value] = key
  })
  const add = (key: JSObjectKeyStrict, value: JSObjectKeyStrict): void => {
    enumeration[key] = value
    enumeration[value] = key
  }
  const remove = (keyOrValue: JSObjectKeyStrict): void => {
    const theOtherKeyOrValue = enumeration[keyOrValue]
    delete enumeration[keyOrValue]
    delete enumeration[theOtherKeyOrValue]
  }
  const get = (keyOrValue: JSObjectKeyStrict) => enumeration[keyOrValue] as K | V
  const getAll = () => enumeration as Enumeration<K, V>
  const has = (keyOrValue: JSObjectKeyStrict): boolean => {
    return hasProperty(enumeration, keyOrValue)
  }
  return {
    add,
    remove,
    has,
    // @ts-expect-error Overloading behavior is a bit weird when not using class
    get,
    getAll,
  }
}
