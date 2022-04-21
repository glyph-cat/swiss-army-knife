/**
 * @public
 * @example
 * const newArray = chunk(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3)
 * console.log(newArray) // [['a', 'b', 'c'], ['d', 'e', 'f'], ['g']]
 */
export function chunk(array: Array<unknown>, size: number): Array<Array<unknown>> {
  let subArray = []
  const chunkedArray = []
  for (let i = 0; i < array.length; i++) {
    const currentItem = array[i]
    subArray.push(currentItem)
    const shouldChop = subArray.length >= size
    if (shouldChop) {
      chunkedArray.push(subArray)
      subArray = []
    }
  }
  // Handle remaining items
  if (subArray.length > 0) {
    chunkedArray.push(subArray)
    subArray = []
  }
  return chunkedArray
}
