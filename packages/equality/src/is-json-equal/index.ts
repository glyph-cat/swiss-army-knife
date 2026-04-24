/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Performs an equality check using `JSON.stringify`.
 * Compares the values after serializing them with [`JSON.stringify`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
 * @param a - The first item to compare.
 * @param b - The second item to compare.
 * @returns `true` if both values are considered equal, otherwise `false`.
 * @public
 */
export function isJSONequal(a: any, b: any): b is typeof a {
  return JSON.stringify(a) === JSON.stringify(b)
}
