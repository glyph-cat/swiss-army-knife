/* eslint-disable @typescript-eslint/no-explicit-any */
import { arrayIsShallowEqual } from '../array-is-shallow-equal'
import { objectIsShallowEqual } from '../object-is-shallow-equal'

/**
 * A wrapper around {@link arrayIsShallowEqual|`arrayIsShallowEqual`} and
 * {@link objectIsShallowEqual|`objectIsShallowEqual`}.
 *
 * Only use this when you cannot determine whether the values to compare will
 * return an array or an object as it exhausts additional computing resources
 * that could otherwise be prevented.
 * @returns `true` if both values are considered equal, otherwise `false`.
 * @public
 */
export function arrayOrObjectIsShallowEqual(a: Array<any> | any, b: Array<any> | any): boolean {

  const aIsArray = Array.isArray(a)
  const bIsArray = Array.isArray(b)
  if (aIsArray !== bIsArray) {
    return false // Early exit
  }
  if (aIsArray && bIsArray) {
    return arrayIsShallowEqual(a, b) // Early exit
  }

  // Eventually will fallback to `Object.is` if not both are objects
  return objectIsShallowEqual(a, b) // Early exit

}
