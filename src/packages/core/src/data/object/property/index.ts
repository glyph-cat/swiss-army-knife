import {
  LenientString,
  PlainRecord,
  PossiblyUndefined,
  StrictPropertyKey,
} from '@glyph-cat/foundation'
import { isNullOrUndefined, isNumber } from '@glyph-cat/type-checking'
import { IS_CLIENT_ENV } from '../../../constants'
import { devError } from '../../../dev'

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
export function hasProperty<T, K extends LenientString<keyof T> | number>(
  object: T,
  propertyName: K,
): object is T & Record<K, unknown> { // TODO; unknown -> T[keyof T] ???
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
  propertyNames: Array<PropertyKey>,
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
  propertyNames: Array<PropertyKey>,
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
  propertyPath: ObjectPathSegments,
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
  propertyPaths: Array<ObjectPathSegments>,
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
  propertyPaths: Array<ObjectPathSegments>,
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
 * @param pathSegments - Path to the property in the object
 * @returns A tuple containing:
 * - `0`: the deeply nested value if it exists, otherwise `undefined`
 * - `1`: a boolean indicating whether the value exists at the specified path
 * @example
 * deepGet({ foo: { bar: 42 } }, 'foo.bar') // [42, true]
 * deepGet({ foo: { bar: 42 } }, 'foo.baz') // [undefined, false]
 * @public
 */
export function deepGet<T = unknown>(
  object: PossiblyUndefined<unknown>,
  pathSegments: ObjectPathSegments,
): [value: PossiblyUndefined<T>, exists: boolean] {
  if (!object) { return [undefined, false] } // Early exit
  let valueRef: PossiblyUndefined<unknown> = object
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
    valueRef = (valueRef as object)[key as keyof typeof valueRef]
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
 * @param pathSegments - Path to the property in the object.
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
  value: unknown,
): void {
  let valueRef: any = object
  if (!Array.isArray(pathSegments)) {
    pathSegments = getObjectPathSegments(pathSegments)
  }
  const indexOfParentOfTarget = pathSegments.length - 1
  for (let i = 0; i <= indexOfParentOfTarget; i++) {
    const pathSegment = pathSegments[i]
    if (i === indexOfParentOfTarget) {
      valueRef[pathSegment as keyof typeof valueRef] = value
    } else {
      if (!Object.prototype.hasOwnProperty.call(valueRef, pathSegment)) {
        // If not number, then could be string or symbol:
        valueRef[pathSegment] = isNumber(pathSegments[i + 1]) ? [] : {}
      }
      valueRef = valueRef[pathSegment as keyof typeof valueRef]
    }
  }
}

// NOTE:
// `complexDeepSetMutable` is not created to reduce complexity and tech debt.
// Actually, `deepSetMutable` itself is kind of redundant because, it could've
// been done in JavaScript directly, but it is provided just in case there is
// ever such a GUI for modifying JS objects that requires this utility.

/**
 * Creates a new object with the deeply nested property modified.
 * This does not mutate the original object.
 *
 * If in-between properties do not already exist they will be created automatically:
 * - if the path segment is a number, an array will be created
 * - if the path segment is a string or symbol, an object will be created
 *
 * If in-between properties already exist, their original types will be respected.
 * For example, if a path segment is a number type but the in-between property
 * is an object, then it will remain as an object even if the path segment is a number.
 *
 * Path segments can be specified as a string and they will be automatically split
 * into an array containing either strings or numbers. To learn more about
 * the splitting behavior, see {@link getObjectPathSegments}.
 *
 * @param object - The object to modify.
 * @param pathSegments - Path to the property in the object.
 * @param value - The value to set.
 * @returns A new object with the modified property.
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
 * @public
 */
export function deepSet<T>(
  object: T,
  pathSegments: ObjectPathSegments,
  value: unknown,
): T {
  if (!Array.isArray(pathSegments)) {
    pathSegments = getObjectPathSegments(pathSegments)
  }
  return recursiveAssign<T>(object, true, pathSegments, value)
}

/**
 * @internal
 */
function recursiveAssign<T>(
  object: T,
  objectExists: boolean,
  pathSegments: Array<PropertyKey>,
  value: unknown,
): T {
  const [pathSegment, ...nextPathSegments] = pathSegments
  if (Array.isArray(object) || (!objectExists && isNumber(pathSegment))) {
    const arr = [...(object as Array<unknown>) ?? []]
    arr[pathSegment as number] = nextPathSegments.length > 0
      ? recursiveAssign(
        arr[pathSegment as number],
        hasProperty(arr, pathSegment as StrictPropertyKey),
        nextPathSegments,
        value,
      )
      : value
    return arr as T
  } else {
    return {
      ...object,
      [pathSegment]: nextPathSegments.length > 0
        ? recursiveAssign(
          object?.[pathSegment as keyof typeof object],
          hasProperty(object, pathSegment as string),
          nextPathSegments,
          value,
        )
        : value,
    }
  }
}

/**
 * Creates a new object with the deeply nested property modified.
 * This does not mutate the original object.
 * This is similar to {@link deepSet} except the value is modified using a function
 * where the function will have context to the current value of the property that
 * it is about to replace.
 * @param object - The object to modify.
 * @param pathSegments - Path to the property in the object.
 * @param setter - A function that receives two parameters (the current value if
 * the property exists, else undefined, and a boolean indicating whether the property
 * exists (NOTE: a property can exist while having `undefined` as value)).
 * @returns A new object with the modified property.
 * @example
 * const sourceObject = { foo: { bar: 1 } }
 * const output = deepSet(sourceObject, 'foo.bar', (value) => value + 1)
 * // sourceObject: { foo: { bar: 1 } }
 * //       output: { foo: { bar: 2 } }
 * @public
 */
export function complexDeepSet<T, K = unknown>(
  object: T,
  pathSegments: ObjectPathSegments,
  setter: (value: K, exists: boolean) => unknown,
): T {
  if (!Array.isArray(pathSegments)) {
    pathSegments = getObjectPathSegments(pathSegments)
  }
  return complexRecursiveAssign<T, K>(object, pathSegments, setter, true)
}

/**
 * @internal
 */
function complexRecursiveAssign<T, K>(
  object: T,
  pathSegments: Array<PropertyKey>,
  setter: (value: K, exists: boolean) => unknown,
  exists: boolean,
): T {
  const [pathSegment, ...nextPathSegments] = pathSegments
  const nextExists = exists ? Object.prototype.hasOwnProperty.call(object, pathSegment) : false
  if (Array.isArray(object) || (!exists && isNumber(pathSegment))) {
    const arr = [...(exists ? object as Array<unknown> : [])]
    arr[pathSegment as number] = nextPathSegments.length > 0
      ? complexRecursiveAssign(arr[pathSegment as number], nextPathSegments, setter, nextExists)
      : setter(object?.[pathSegment as keyof typeof object] as unknown as K, nextExists)
    return arr as T
  } else {
    return {
      ...object,
      [pathSegment]: nextPathSegments.length > 0
        ? complexRecursiveAssign(
          object?.[pathSegment as keyof typeof object],
          nextPathSegments,
          setter,
          nextExists,
        )
        : setter((object as any)?.[pathSegment], nextExists),
    }
  }
}

/**
 * @public
 */
export interface DeepRemoveOptions {
  /**
   * Removes the parent property when its last child item is also removed.
   * @defaultValue `false`
   */
  clean?: boolean
}

/**
 * Creates a new object with the deeply nested property removed.
 * This does not mutate the original object.
 *
 * NOTE: For arrays, the element will be removed using the
 * [splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
 * method. To preserve the order of elements, consider using {@link deepSet} to
 * replace the values with `null` or `undefined` instead.
 * @param object - The object to modify.
 * @param pathSegments - Path to the property in the object.
 * @param options - Additional options to configure the behavior of removal.
 * @returns A new object with the deeply nested property removed.
 * @example
 * const sourceObject = { foo: { bar: { baz: 42 } } }
 * const output = deepRemove(sourceObject, 'foo.bar.baz')
 * // sourceObject: { foo: { bar: { baz: 42 } } }
 * //       output: { foo: { bar: {} } }
 * @example
 * const sourceObject = { foo: { bar: { baz: 42 } } }
 * const output = deepRemove(sourceObject, 'foo.bar.baz', { clean: true })
 * // sourceObject: { foo: { bar: { baz: 42 } } }
 * //       output: {}
 * @public
 */
export function deepRemove<T>(
  object: T,
  pathSegments: ObjectPathSegments,
  options?: DeepRemoveOptions,
): T {
  if (!Array.isArray(pathSegments)) {
    pathSegments = getObjectPathSegments(pathSegments)
  }
  return recursiveRemove<T>(object, pathSegments, options)[0]
}

function recursiveRemove<T>(
  object: T,
  pathSegments: Array<PropertyKey>,
  options: PossiblyUndefined<DeepRemoveOptions>,
): [filteredObject: T, nextPropertyExists?: boolean] {

  if (isNullOrUndefined(object)) {
    return [object, false] // Early exit
    // Since object is null or undefined, it would be logical to assume that its
    // sub-property does not exist too
  }
  const [pathSegment, ...nextPathSegments] = pathSegments
  if (!Object.prototype.hasOwnProperty.call(object, pathSegment)) {
    return [object, false] // Early exit
  }

  if (Array.isArray(object)) {
    const remainingItems = [...object as Array<unknown>]
    const [nextProperty] = remainingItems.splice(pathSegment as number, 1)
    if (nextPathSegments.length > 0) {
      const [
        nextPropertyPostProcess,
        nextPropertyExists,
      ] = recursiveRemove(nextProperty, nextPathSegments, options)
      if (!options?.clean || nextPropertyExists) {
        remainingItems.splice(pathSegment as number, 0, nextPropertyPostProcess)
      }
      return [
        remainingItems as T,
        options?.clean ? remainingItems.length > 0 : true,
      ]
    } else {
      return [
        remainingItems as T,
        options?.clean ? remainingItems.length > 0 : true,
      ]
    }
  } else {
    // This is to ensure order of keys remain untouched as much as possible
    const shallowCopiedObject = { ...object }
    const nextProperty = shallowCopiedObject[pathSegment as keyof typeof shallowCopiedObject]
    if (nextPathSegments.length > 0) {
      const [
        nextPropertyPostProcess,
        nextPropertyExists,
      ] = recursiveRemove(nextProperty, nextPathSegments, options)
      if (options?.clean && !nextPropertyExists) {
        delete shallowCopiedObject[pathSegment as keyof typeof shallowCopiedObject]
      } else {
        shallowCopiedObject[pathSegment as keyof typeof shallowCopiedObject] = nextPropertyPostProcess
      }
      return [
        shallowCopiedObject as T,
        options?.clean ? Object.keys(shallowCopiedObject as object).length > 0 : true,
      ]
    } else {
      const { [pathSegment]: _toRemove, ...remainingItems } = object as PlainRecord
      return [
        remainingItems as T,
        options?.clean ? Object.keys(remainingItems).length > 0 : true,
      ]
    }
  }

}
