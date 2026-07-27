/**
 * @public
 * @example
 * const newArray = chunk(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3)
 * console.log(newArray) // [['a', 'b', 'c'], ['d', 'e', 'f'], ['g']]
 */
export function chunk<T>(array: Array<T>, size: number): Array<Array<T>> {
  const result: Array<Array<T>> = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
