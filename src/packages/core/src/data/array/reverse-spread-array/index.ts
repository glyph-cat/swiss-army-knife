import { PossiblyUndefined } from '@glyph-cat/foundation'

/**
 * Just as the name suggests, destructure an array the other way round.
 * @param array - The array to spread.
 * @param itemsToSpread - The spread syntax.
 * @returns The spreaded array.
 * @example
 * const myList = [7, 6, 5, 4, 3, 2, 1]
 * // Imagine if this exists:
 * // const [...remainingItems, d, c, b, a] = myList
 * const [remainingItems, d, c, b, a] = reverseSpreadArray(myList, 4)
 * console.log(remainingItems) // [7, 6, 5]
 * console.log(a) // 1
 * console.log(b) // 2
 * console.log(c) // 3
 * console.log(d) // 4
 * @public
 */
export function reverseSpreadArray<T>(
  array: Array<T>,
  itemsToSpread: number,
): [Array<T>, ...Array<PossiblyUndefined<T>>] {
  const localArray: Array<T> = [...array]
  const spreadedItems: Array<PossiblyUndefined<T>> = []
  for (let i = 0; i < itemsToSpread; i++) {
    spreadedItems.push(localArray.pop())
  }
  return [localArray, ...spreadedItems]
}
