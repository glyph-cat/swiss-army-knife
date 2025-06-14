/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObjectNotNull } from '../../../core/src/data/type-check'

/**
 * Compares each item in the object using [`Object.is`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
 * @returns `true` if both values are considered equal, otherwise `false`.
 * @public
 */
export function objectShallowEqual(a: any, b: any): boolean {

  if (isObjectNotNull(a) && isObjectNotNull(b)) {

    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)

    if (aKeys.length !== bKeys.length) {
      return false // Early exit
    }

    // NOTE: We probably don't need this, if position of the key-value pairs
    // change without the actual keys or values changing, we should still
    // treat it as 'not equal'.
    // const allKeys = [...new Set([...aKeys, ...bKeys])]

    for (let i = 0; i < aKeys.length; i++) {
      const aKey = aKeys[i]
      const bKey = bKeys[i]
      if (aKey !== bKey) {
        return false // Early exit
      }
      if (!Object.is(a[aKey], b[bKey])) {
        return false // Early exit
      }
    }

    return true

  } else {
    return Object.is(a, b) // Fallback
  }

}

/**
 * Compares each item in the object using [`Object.is`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
 * @returns `true` if both values are considered equal, otherwise `false`.
 * @public
 * @deprecated Please use {@link objectShallowEqual|`objectShallowEqual`} instead.
 */
export const shallowCompareObject = objectShallowEqual
