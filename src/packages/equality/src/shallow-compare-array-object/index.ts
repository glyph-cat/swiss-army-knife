/* eslint-disable @typescript-eslint/no-explicit-any */
import { shallowCompareArray } from '../shallow-compare-array'
import { shallowCompareObject } from '../shallow-compare-object'

/**
 * A wrapper around `shallowCompareArray` and `shallowCompareObject`.
 * Only use this when you cannot determine whether the values to compare will
 * return an array or an object as it exhausts additional computing resources
 * that could otherwise be prevented.
 * @returns `true` if both values are considered equal, otherwise `false`.
 * @public
 */
export function shallowCompareArrayOrObject(a: Array<any> | any, b: Array<any> | any): boolean {

  const aIsArray = Array.isArray(a)
  const bIsArray = Array.isArray(b)
  if (aIsArray !== bIsArray) {
    return false // Early exit
  }
  if (aIsArray && bIsArray) {
    return shallowCompareArray(a, b) // Early exit
  }

  // Eventually will fallback to `Object.is` if not both are objects
  return shallowCompareObject(a, b) // Early exit

}
