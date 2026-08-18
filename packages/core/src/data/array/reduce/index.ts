import { Fn } from '@glyph-cat/foundation'

/**
 * A async version of `Array.reduce` for better readability.
 * @param array - The array to reduce.
 * @param callback - The callback that runs for each item in the array.
 * @param accumulator - The "initial value"
 * @returns The reduced value.
 * @public
 */
export async function asyncReduce<T, K>(
  array: Array<T>,
  callback: Fn<[accumulator: K, item: T, index: number, array: Array<T>], Promise<K>>,
  accumulator: K,
): Promise<K> {
  await Promise.all(array.map(async (item, index, $array) => {
    accumulator = await callback(accumulator, item, index, $array)
  }))
  return accumulator
}
