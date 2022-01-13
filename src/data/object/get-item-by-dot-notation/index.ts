/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */

import { EMPTY_OBJECT } from '../../dummies'

/**
 * Access object properties by dot notation.
 * @author Alnitak
 * @see https://stackoverflow.com/a/6491621 (adapted)
 * @param object - The object containing the property/value of interest.
 * @param path - Path to a property in the object.
 * @returns The value at the specified path.
 * @example
 * // Normal scenario
 * const obj = { category: { group: { item: 'foobar' } } }
 * const output = getItemByDotNotation(obj, 'category.group.item')
 * console.log(output) // 'foobar'
 * @example
 * // If property exists but is `undefined`
 * import { getItemByDotNotation, EMPTY_OBJECT } from '{:PACKAGE_NAME:}'
 *
 * const obj = { category: { group: { item: undefined } } }
 * const output = getItemByDotNotation(obj, 'category.group.item')
 * if (Object.is(output, EMPTY_OBJECT)) {
 *   console.log(`Property does not exists.`)
 * } else {
 *   console.log(`Property exists! It's value is ${output}.`)
 *   // Property exists! It's value is undefined.
 * }
 * @public
 */
export function getItemByDotNotation(
  object: any,
  path: number | string
): any | typeof EMPTY_OBJECT {
  let _key = String(path)
  _key = _key.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  _key = _key.replace(/^\./, '')           // strip a leading dot
  const pathStack = _key.split('.')
  for (let i = 0, n = pathStack.length; i < n; ++i) {
    const k = pathStack[i]
    if (k in object) {
      object = object[k]
    } else {
      return EMPTY_OBJECT
    }
  }
  return object
}
