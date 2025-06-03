/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Compares the values after serializing them with [\`JSON.stringify\`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
 * @returns `true` if both values are considered equal, otherwise `false`.
 * @public
 * @deprecated Please use {@link isJsonEqual|`isJsonEqual`} instead.
 */
export function stringifyCompare(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * Compares the values after serializing them with [\`JSON.stringify\`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
 * @returns `true` if both values are considered equal, otherwise `false`.
 * @public
 */
export function isJsonEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}
