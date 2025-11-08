/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Compares each element in the array using [`Object.is`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
 * @returns `true` if both values are considered equal, otherwise `false`.
 * @public
 */
export function arrayIsShallowEqual(a: Array<any> | any, b: Array<any> | any): boolean {

  // In case non-array type is provided due to lack of TS enforcement in a JS-only setup.
  if (!Object.is(a?.length, b?.length)) {
    return false // Early exit
  }

  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) {
      return false // Early exit
    }
  }

  return true

}
