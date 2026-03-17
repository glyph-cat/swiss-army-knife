import { Fn, ReadWritableArray } from '@glyph-cat/foundation'
import { isFunction } from '@glyph-cat/type-checking'

/**
 * Remove duplicates from an array.
 * @param values - The array containing possible duplicate.
 * @returns A new array without duplicates.
 * @example
 * const list = removeDuplicates(1, 2, 2, 3, 1, 2, 4)
 * // [1, 2, 3, 4]
 * @public
 */
export function removeDuplicates<T>(values: Array<T>): Array<T>

/**
 * Remove duplicates from an array.
 * @param values - The array containing possible duplicate.
 * @param key - Key representing the unique value of each item in the array.
 * @returns A new array without duplicates.
 * @example
 * const list = removeDuplicates({ id: 1 }, { id: 2 }, { id: 1 }, 'id')
 * // [{ id: 1 }, { id: 2 }]
 * @public
 */
export function removeDuplicates<T>(values: Array<T>, key: keyof T): Array<T>

/**
 * Remove duplicates from an array.
 * @param values - The array containing possible duplicate.
 * @param predicate - Function that extracts the unique value of each item in the array.
 * @returns A new array without duplicates.
 * @example
 * const list = removeDuplicates({ id: 1 }, { id: 2 }, { id: 1 }, (item) => item.id)
 * // [{ id: 1 }, { id: 2 }]
 * @public
 */
export function removeDuplicates<T>(
  values: Array<T>,
  predicate: Fn<[T, number, Array<T>], unknown>,
): Array<T>

/**
 * Remove duplicates from an array.
 * @param values - The array containing possible duplicate.
 * @returns A new array without duplicates.
 * @example
 * const list = removeDuplicates(1, 2, 2, 3, 1, 2, 4)
 * // [1, 2, 3, 4]
 * @public
 */
export function removeDuplicates<T>(values: ReadonlyArray<T>): ReadonlyArray<T>

/**
 * Remove duplicates from an array.
 * @param values - The array containing possible duplicate.
 * @param key - Key representing the unique value of each item in the array.
 * @returns A new array without duplicates.
 * @example
 * const list = removeDuplicates({ id: 1 }, { id: 2 }, { id: 1 }, 'id')
 * // [{ id: 1 }, { id: 2 }]
 * @public
 */
export function removeDuplicates<T>(values: ReadonlyArray<T>, key: keyof T): ReadonlyArray<T>

/**
 * Remove duplicates from an array.
 * @param values - The array containing possible duplicate.
 * @param predicate - Function that extracts the unique value of each item in the array.
 * @returns A new array without duplicates.
 * @example
 * const list = removeDuplicates({ id: 1 }, { id: 2 }, { id: 1 }, (item) => item.id)
 * // [{ id: 1 }, { id: 2 }]
 * @public
 */
export function removeDuplicates<T>(
  values: ReadonlyArray<T>,
  predicate: Fn<[T, number, Array<T>], unknown>,
): ReadonlyArray<T>

export function removeDuplicates<T>(
  values: ReadWritableArray<T>,
  keyOrPredicate?: keyof T | Fn<[T, number, Array<T>], unknown>
): Array<T> {
  if (keyOrPredicate) {
    // Split logic by key or predicate so that evaluation is not needed
    // in each `.map` iteration:
    if (isFunction(keyOrPredicate)) {
      const predicate = keyOrPredicate
      return [...new Map(values.map((value, index, array) => [
        predicate(value, index, array as Array<T>),
        value,
      ])).values()]
    } else {
      const key = keyOrPredicate
      return [...new Map(values.map((value) => [value[key], value])).values()]
    }
  } else {
    return [...new Set(values)]
  }
}
