import { Nullable } from '../../nullable'

/**
 * Picks the last item from an array.
 * @param array - The array to pick from.
 * @param index - Optional, when passed used as an offset to pick the last n item.
 * @returns The selected item
 * @example
 * pickLast([1, 2, 3, 4]) // 4
 * @example
 * pickLast([1, 2, 3, 4], 1) // 3
 * @public
 */
export function pickLast<T>(array: Array<T>, index = 0): T {
  return array[Math.max(0, array.length - 1 - index)]
}

/**
 * Picks the first occurring item where the `searchFn` returns `true` for,
 * with the loop starting from the last item of the array.
 * @param array - The array to pick from.
 * @param searchFn - The callback that will be invoked for each element in the
 * array until one of them returns `true`.
 * @returns The item in the array if found, otherwise `null`.
 * @example
 * pickLastWhere([2, 4, 5, 7], (value) => isEven(value)) // 4
 * @public
 */
export function pickLastWhere<T>(
  array: Array<T>,
  searchFn: (item: T, index: number) => boolean
): Nullable<T> {
  for (let i = array.length - 1; i >= 0; i--) {
    if (searchFn(array[i], i)) {
      return array[i]
    }
  }
  return null
}
