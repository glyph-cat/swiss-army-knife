import { ReadWritableArray } from '@glyph-cat/foundation'

/**
 * Remove duplicates from an array using `Set`.
 * @param array - The array containing possible duplicate.
 * @returns An array without duplicates.
 * @example
 * const list = removeDuplicates(1, 2, 2, 3, 1, 2, 4)
 * console.log(list) // [1, 2, 3, 4]
 * @public
 */
export function removeDuplicates<T>(array: Array<T>): Array<T>

/**
 * Remove duplicates from an array using `Set`.
 * @param array - The array containing possible duplicate.
 * @returns An array without duplicates.
 * @example
 * const list = removeDuplicates(1, 2, 2, 3, 1, 2, 4)
 * console.log(list) // [1, 2, 3, 4]
 * @public
 */
export function removeDuplicates<T>(array: ReadonlyArray<T>): ReadonlyArray<T>

export function removeDuplicates<T>(array: ReadWritableArray<T>): Array<T> {
  return [...new Set(array)]
}


const x = removeDuplicates([1, 2, 3])
const y = removeDuplicates([1, 2, 3] as const)
const z = removeDuplicates([1, 2, 3] as ReadonlyArray<number>)

