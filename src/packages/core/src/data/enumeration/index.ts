import { StrictPropertyKey } from '../../types'
import { hasProperty } from '../object/property'

/**
 * "Autofill" key-value properties in enums where values are non-numeric.
 * This mutates the original enum.
 * @example
 * enum SomeEnum {
 *   FOO = 'a',
 *   BAR = 'b',
 * }
 * console.log(SomeEnum[SomeEnum.a]) // undefined
 * fullyEnumerate(SomeEnum)
 * console.log(SomeEnum[SomeEnum.a]) // 'FOO'
 * @public
 */
export function fullyEnumerate<Enum extends object>(enumObj: Enum): void {
  const allKeys = Object.keys(enumObj)
  for (const key of allKeys) {
    // // @ts-expect-error because we are forcefully injecting values
    enumObj[enumObj[key]] = key
  }
}

/**
 * @public
 */
export type Enumeration<K extends StrictPropertyKey, V extends StrictPropertyKey> = Record<K | V, V | K>

/**
 * Creates an enumeration from an object that is similar to TypeScript's `enum`.
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
export function enumerate<K extends StrictPropertyKey, V extends StrictPropertyKey>(
  entries: Record<K, V>,
): Enumeration<K, V> {
  const enumeration = {} as Enumeration<K, V>
  for (const key in entries) {
    const value = entries[key]
    enumeration[key as StrictPropertyKey] = value as StrictPropertyKey
    enumeration[value as StrictPropertyKey] = key
  }
  Object.freeze(enumeration)
  return enumeration
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Creates a function that converts a value back to its enum key.
 * If the value does not belong to the enum, it will be converted into a string as-is.
 * @param enumObject - The enum
 * @returns A function that converts a value back to its enum key.
 * @public
 */
export function createEnumToStringConverter<T>(enumObject: any): ((value: T) => string) {
  return (value) => String(enumObject[value] ?? value)
}
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

/**
 * Creates an enumeration from an object that is similar to TypeScript's `enum`,
 * but with additional flexibility of mutating the values.
 * @public
 */
export class MutableEnumeration<K extends StrictPropertyKey, V extends StrictPropertyKey> {

  /**
   * Underlying data of the enumeration.
   * @internal
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
    for (const key in entries) {
      const value = entries[key]
      this.M$enumeration[key] = value
      this.M$enumeration[value] = key
    }
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
    key: StrictPropertyKey,
    value: StrictPropertyKey,
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
  remove(keyOrValue: StrictPropertyKey): MutableEnumeration<K, V> {
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

  get(keyOrValue: StrictPropertyKey): K | V {
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
  has(keyOrValue: StrictPropertyKey): boolean {
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
