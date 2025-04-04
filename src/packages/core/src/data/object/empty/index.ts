/**
 * Checks if an object is empty with O(1) performance.
 * @param object - The object to evaluate.
 * @returns `true` if the object is empty (or falsey), otherwise `false`.
 * @public
 */
export function isEmptyObject(object: Record<PropertyKey, unknown>): boolean {
  if (!object) { return true } // Early exit
  for (const key in object) {
    return false
  }
  return true
}

/**
 * Checks if an object is not empty (or falsey) with O(1) performance.
 * @param object - The object to evaluate.
 * @returns `true` if the object is not empty, otherwise `false`.
 * Also returns `false` if the object is falsey.
 * @public
 */
export function isNotEmptyObject(object: Record<PropertyKey, unknown>): boolean {
  if (!object) { return false } // Early exit
  for (const key in object) {
    return true
  }
  return false
}
