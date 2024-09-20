import { IS_CLIENT_ENV } from '../../../constants'
import { devError } from '../../../dev'
import { StrictPropertyKey } from '../../../types'
import { isNumber } from '../../type-check'

/**
 * @public
 */
export type ObjectPathSegments = Array<PropertyKey> | string

/**
 * Checks if a property exists in an object.
 * This excludes the object's prototype.
 * @param object - The object to check.
 * @param propertyName - Name of property to check.
 * @returns `true` if the property exists in the object, otherwise `false`.
 * @example
 * hasProperty({ foo: 'bar' }, 'foo') // true
 * hasProperty({ foo: 'bar' }, 'whooosh') // false
 * @public
 */
export function hasProperty(
  object: unknown,
  propertyName: PropertyKey
): boolean {
  if (!object) { return false } // Early exit
  return Object.prototype.hasOwnProperty.call(object, propertyName)
}

/**
 * Checks if either one of the specified properties exist in an object.
 * This excludes the object's prototype.
 * @param object - The object to check.
 * @param propertyName - Name of properties to check.
 * @returns `true` if either one of the properties exist in the object,
 * otherwise `false`.
 * @public
 */
export function hasEitherProperties(
  object: unknown,
  propertyNames: Array<PropertyKey>
): boolean {
  if (IS_CLIENT_ENV) {
    if (propertyNames.length < 1) {
      devError('Expected there to be at least one property name but got none')
    }
  }
  if (!object) { return false } // Early exit
  for (const propertyName of propertyNames) {
    if (Object.prototype.hasOwnProperty.call(object, propertyName)) {
      return true // Early exit
    }
  }
  return false
}

/**
 * Checks if all of the specified properties exist in an object.
 * This excludes the object's prototype.
 * @param object - The object to check.
 * @param propertyName - Name of properties to check.
 * @returns `true` if all of the properties exists in the object,
 * otherwise `false`.
 * @public
 */
export function hasTheseProperties(
  object: unknown,
  propertyNames: Array<PropertyKey>
): boolean {
  if (IS_CLIENT_ENV) {
    if (propertyNames.length < 1) {
      devError('Expected there to be at least one property name but got none')
    }
  }
  if (!object) { return false } // Early exit
  for (const propertyName of propertyNames) {
    if (!Object.prototype.hasOwnProperty.call(object, propertyName)) {
      return false // Early exit
    }
  }
  return true
}

/**
 * Breaks down string representing a path to a deeply nested property in an object
 * into an array.
 *
 * Tokenization strategy:
 * ### `bar` will be treated as a string (object property) in the following conditions:
 * ```txt
 *   - foo.bar    // preceded by a dot
 *   - foo[bar]   // closed in square brackets
 *   - foo["bar"] // closed in square brackets with double quotes
 *   - foo['bar'] // closed in square brackets with single quotes
 *   - foo[`bar`] // closed in square brackets with backtick quotes
 * ```
 *
 * ### `42` will be treated as a string (object property) in the following conditions:
 * ```txt
 *   - foo.42     // preceded by a dot
 *   - foo["42"]  // closed in square brackets with double quotes
 *   - foo['42']  // closed in square brackets with single quotes
 *   - foo[`42`]  // closed in square brackets with backtick quotes
 *   - foo[bar]42 // preceded by closing square bracket
 * ```
 *
 * ### `42` will be treated as a number (array index) in the following condition:
 * ```txt
 *   - foo[42]    // closed in square brackets
 * ```
 *
 * ### Miscellaneous
 * ```txt
 * // Optional chaining operators (`?.`) will be ignored
 *   - foo?.bar     // = foo.bar
 *   - foo?.['bar'] // = foo['bar']
 * // Quotes within quotes are preserved
 *   - [""a"]
 * // Empty segments will be ignored
 *   - a..b[]c      // = a.b.c
 * ```
 * @param path - Path to a deeply nested property in an object.
 * @returns An array representing the path to the deeply nested property.
 * @example
 * getObjectPathAsArray('foo.bar[baz]["qux"]["0"][1]')
 * // Output: ['foo', 'bar', 'baz', '0', 1]
 * @public
 */
export function getObjectPathSegments(path: string): Array<StrictPropertyKey> {
  path = path
    .replace(/[.\]]([\d][\da-z_-]*)/gi, '["$1"]')
    .replace(/[\]?]/g, '')
    .replace(/\.?\[/g, '.')
  const rawPathSegments = path.split(/\.\[?/g)
  const pathSegments: Array<StrictPropertyKey> = []
  for (let i = 0; i < rawPathSegments.length; i++) {
    if (rawPathSegments[i].length <= 0) { continue }
    if (/^\d+$/.test(rawPathSegments[i])) {
      pathSegments.push(Number(rawPathSegments[i]))
    } else {
      pathSegments.push(rawPathSegments[i].replace(/^["'`]/, '').replace(/["'`]$/, ''))
    }
  }
  return pathSegments
}

/**
 * Checks if a deeply nested value exists within an object.
 * This excludes the object's and it's sub-objects' prototype.
 * @param object - The object to check.
 * @param propertyPath - Path to the deeply nested property.
 * @returns `true` if the object contains the deeply nested property, otherwise `false`.
 * @example
 * hasDeepProperty(someObject, 'foo.bar.baz[0]')
 * hasDeepProperty(someObject, ['foo', 'bar', 'baz', 0])
 * @public
 */
export function hasDeepProperty(
  object: unknown,
  propertyPath: ObjectPathSegments
): boolean {
  return deepGet(object, propertyPath)[1]
}

/**
 * Checks if either one of the deeply nested properties exist in an object.
 * This excludes the object's and it's sub-objects' prototype.
 * @param object - The object to check.
 * @param propertyPaths - Paths to the deeply nested properties.
 * @returns `true` if either one of the properties exist in the object,
 * otherwise `false`.
 * @example
 * hasEitherDeepProperties(someObject, [
 *   'foo.a',
 *   'foo.b',
 *   'bar.a',
 * ])
 * @public
 */
export function hasEitherDeepProperties(
  object: unknown,
  propertyPaths: Array<ObjectPathSegments>
): boolean {
  if (IS_CLIENT_ENV) {
    if (propertyPaths.length < 1) {
      devError('Expected there to be at least one property path but got none')
    }
  }
  if (!object) { return false } // Early exit
  for (const propertyPath of propertyPaths) {
    if (deepGet(object, propertyPath)[1]) {
      return true // Early exit
    }
  }
  return false
}

/**
 * Checks if all of the specified properties exist in an object.
 * This excludes the object's and it's sub-objects' prototype.
 * @param object - The object to check.
 * @param propertyPaths - Paths to the deeply nested properties.
 * @returns `true` if all of the properties exists in the object,
 * otherwise `false`.
 * @example
 * hasTheseDeepProperties(someObject, [
 *   'foo.a',
 *   'foo.b',
 *   'bar.a',
 * ])
 * @public
 */
export function hasTheseDeepProperties(
  object: unknown,
  propertyPaths: Array<ObjectPathSegments>
): boolean {
  if (IS_CLIENT_ENV) {
    if (propertyPaths.length < 1) {
      devError('Expected there to be at least one property path but got none')
    }
  }
  if (!object) { return false } // Early exit
  for (const propertyPath of propertyPaths) {
    if (!deepGet(object, propertyPath)[1]) {
      return false // Early exit
    }
  }
  return true
}

/**
 * Gets a value from a deeply nested object.
 * @param object - The source object
 * @param pathSegments - Path to the value in the object
 * @returns A tuple containing:
 * - `0`: the deeply nested value if it exists, otherwise `undefined`
 * - `1`: a boolean indicating whether the value exists at the specified path
 * @example
 * deepGet({ foo: { bar: 42 } }, 'foo.bar') // [42, true]
 * deepGet({ foo: { bar: 42 } }, 'foo.baz') // [undefined, false]
 * @public
 */
export function deepGet<T = unknown>(
  object: unknown,
  pathSegments: ObjectPathSegments
): [value: T, exists: boolean] {
  if (!object) { return [undefined, false] } // Early exit
  let valueRef: unknown = object
  if (!Array.isArray(pathSegments)) {
    pathSegments = getObjectPathSegments(pathSegments)
  }
  if (IS_CLIENT_ENV) {
    if (pathSegments.length <= 0) {
      devError('Expected there to be at least one path segment but got none')
    }
  }
  for (let i = 0; i < pathSegments.length; i++) {
    const key = pathSegments[i]
    if (!Object.prototype.hasOwnProperty.call(valueRef, key)) {
      return [undefined, false]
    }
    valueRef = valueRef[key]
  }
  return [valueRef as T, true]
}

/**
 * Sets a deeply nested value inside an object. This mutates the original object.
 *
 * If in-between properties do not already exist they will be created automatically:
 * - if the path segment is a number, an array will be created
 * - if the path segment is a string or symbol, an object will be created
 *
 * Path segments can be specified as a string and they will be automatically split
 * into an array containing either strings or numbers. To learn more about
 * the splitting behavior, see {@link getObjectPathSegments}.
 *
 * @param object - The object to modify.
 * @param pathSegments - Path to the value in the object.
 * @param value - The value to set.
 * @example
 * const sourceObject = { foo: 1 }
 * deepSet(sourceObject, 'bar.baz[0]', 42)
 * // sourceObject:
 * // {
 * //   foo: 1,
 * //   bar: {
 * //     baz: [42],
 * //   },
 * // }
 * @public
 */
export function deepSetMutable(
  object: unknown,
  pathSegments: ObjectPathSegments,
  value: unknown
): void {
  let valueRef: unknown = object
  if (!Array.isArray(pathSegments)) {
    pathSegments = getObjectPathSegments(pathSegments)
  }
  const indexOfParentOfTarget = pathSegments.length - 1
  for (let i = 0; i <= indexOfParentOfTarget; i++) {
    const pathSegment = pathSegments[i]
    if (i === indexOfParentOfTarget) {
      valueRef[pathSegment] = value
    } else {
      if (!Object.prototype.hasOwnProperty.call(valueRef, pathSegment)) {
        // If not number, then could be string or symbol:
        valueRef[pathSegment] = isNumber(pathSegments[i + 1]) ? [] : {}
      }
      valueRef = valueRef[pathSegment]
    }
  }
}

/**
 * Creates a new object with the deeply nested property modified.
 * This does not mutate the original object.
 *
 * If in-between properties do not already exist they will be created automatically:
 * - if the path segment is a number, an array will be created
 * - if the path segment is a string or symbol, an object will be created
 *
 * Path segments can be specified as a string and they will be automatically split
 * into an array containing either strings or numbers. To learn more about
 * the splitting behavior, see {@link getObjectPathSegments}.
 *
 * @param object - The object to modify.
 * @param pathSegments - Path to the value in the object.
 * @param value - The value to set.
 * @returns A new object with the modified value.
 * @example
 * const sourceObject = { foo: 1 }
 * const output = deepSet(sourceObject, 'bar.baz[0]', 42)
 * // sourceObject:
 * // { foo: 1 }
 * //
 * // output:
 * // {
 * //   foo: 1,
 * //   bar: {
 * //     baz: [42],
 * //   },
 * // }
 */
export function deepSet<T>(
  object: T,
  pathSegments: ObjectPathSegments,
  value: unknown
): T {
  if (!Array.isArray(pathSegments)) {
    pathSegments = getObjectPathSegments(pathSegments)
  }
  return recursiveAssign(object, pathSegments, value)
}

/**
 * @internal
 */
function recursiveAssign<T>(
  object: T,
  pathSegments: Array<PropertyKey>,
  value: unknown
): T {
  const [pathSegment, ...nextPathSegments] = pathSegments
  if (isNumber(pathSegment)) {
    const arr = [...(object as Array<unknown>) ?? []]
    arr[pathSegment] = nextPathSegments.length > 0
      ? recursiveAssign(arr[pathSegment], nextPathSegments, value)
      : value
    return arr as T
  } else {
    return {
      ...object,
      [pathSegment]: nextPathSegments.length > 0
        ? recursiveAssign(object?.[pathSegment], nextPathSegments, value)
        : value,
    }
  }
}
