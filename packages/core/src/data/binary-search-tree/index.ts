/**
 * @public
 */
export interface IBinarySearchTreeNode<T> {
  value: T
  left?: IBinarySearchTreeNode<T>
  right?: IBinarySearchTreeNode<T>
}

/**
 * NOTE: This assumes that the values are already sorted.
 * @public
 */
export function createBinarySearchTree<T>(values: Array<T>): IBinarySearchTreeNode<T> {
  const midpointIndex = Math.floor(values.length / 2)
  const pointer: IBinarySearchTreeNode<T> = { value: values[midpointIndex] }
  const leftChunk = values.slice(0, midpointIndex)
  const rightChunk = values.slice(midpointIndex + 1, values.length)
  if (leftChunk.length > 0) { pointer.left = createBinarySearchTree(leftChunk) }
  if (rightChunk.length > 0) { pointer.right = createBinarySearchTree(rightChunk) }
  return pointer
}
