/**
 * Remove duplicates from an array using `Set`.
 * @param array - The array containing possible duplicate.
 * @returns An array without duplicates.
 * @example
 * const list = removeDuplicates(1, 2, 2, 3, 1, 2, 4)
 * console.log(list) // [1, 2, 3, 4]
 * @public
 */
export function removeDuplicates<T>(array: Array<T>): Array<T> {
  return [...new Set(array)]
}
