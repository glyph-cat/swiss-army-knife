/**
 * Picks the last item from an array.
 * @param array - The array to pick from.
 * @param index - Optional, when passed used as an offset to pick the last n item.
 * @example
 * pickLast([1, 2, 3, 4]) // 4
 * @example
 * pickLast([1, 2, 3, 4], 1) // 3
 * @returns The selected item
 * @public
 */
export function pickLast<T>(array: Array<T>, index = 0): T {
  return array[Math.max(0, array.length - 1 - index)]
}
