import { chunk } from '../chunk'

/**
 * Combines multiple arrays into one in a crisscross pattern.
 * The literal opposite of {@link chunk}.
 */
export function interleave<T>(...arrays: Array<Array<T>>): Array<T> {
  const payload: Array<T> = []
  // NOTE: `Math.max(...arrays.map((a) => a.length))` might cause call-stack crash
  // if too many arrays and `-Infinity` if no arguments are passed.
  const maxLength = arrays.reduce(((max, array) => Math.max(max, array.length)), 0)
  for (let itemIndex = 0; itemIndex < maxLength; itemIndex++) {
    for (let arrayIndex = 0; arrayIndex < arrays.length; arrayIndex++) {
      if (itemIndex < arrays[arrayIndex].length) {
        payload.push(arrays[arrayIndex][itemIndex])
      }
    }
  }
  return payload
}
