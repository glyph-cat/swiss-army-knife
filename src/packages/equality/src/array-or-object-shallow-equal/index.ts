/* eslint-disable @typescript-eslint/no-explicit-any */
import { arrayShallowEqual } from '../array-shallow-equal'
import { objectShallowEqual } from '../object-shallow-equal'

/**
 * A wrapper around {@link arrayShallowEqual|`arrayShallowEqual`} and
 * {@link objectShallowEqual|`objectShallowEqual`}.
 *
 * Only use this when you cannot determine whether the values to compare will
 * return an array or an object as it exhausts additional computing resources
 * that could otherwise be prevented.
 * @returns `true` if both values are considered equal, otherwise `false`.
 * @public
 */
export function arrayOrObjectShallowEqual(a: Array<any> | any, b: Array<any> | any): boolean {

  const aIsArray = Array.isArray(a)
  const bIsArray = Array.isArray(b)
  if (aIsArray !== bIsArray) {
    return false // Early exit
  }
  if (aIsArray && bIsArray) {
    return arrayShallowEqual(a, b) // Early exit
  }

  // Eventually will fallback to `Object.is` if not both are objects
  return objectShallowEqual(a, b) // Early exit

}

/**
 * A wrapper around {@link arrayShallowEqual|`arrayShallowEqual`} and
 * {@link objectShallowEqual|`objectShallowEqual`}.
 *
 * Only use this when you cannot determine whether the values to compare will
 * return an array or an object as it exhausts additional computing resources
 * that could otherwise be prevented.
 * @returns `true` if both values are considered equal, otherwise `false`.
 * @public
 * @deprecated Please use {@link arrayOrObjectShallowEqual|`arrayOrObjectShallowEqual`} instead.
 */
export const shallowCompareArrayOrObject = arrayOrObjectShallowEqual
