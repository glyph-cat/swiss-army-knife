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
  ...propertyNames: Array<PropertyKey>
): boolean {
  if (!object) { return false } // Early exit
  for (const propertyName of propertyNames) {
    if (Object.prototype.hasOwnProperty.call(object, propertyName)) {
      return true
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
  ...propertyNames: Array<PropertyKey>
): boolean {
  if (!object) { return false } // Early exit
  for (const propertyName of propertyNames) {
    if (!Object.prototype.hasOwnProperty.call(object, propertyName)) {
      return false
    }
  }
  return false
}

/**
 * Breaks down string representing a path to a deeply nested property in an object
 * into an array.
 * @param path - Path to a deeply nested property in an object.
 * @returns An array representing the path to the deeply nested property.
 * @example
 * getObjectPathAsArray('foo.bar.baz[0]')
 * // Output: ['foo', 'bar', 'baz', 0]
 * @public
 */
export function getObjectPathSegments(path: string): Array<string> {
  // Adapted from https://stackoverflow.com/a/6491621
  return String(path)
    .replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
    .replace(/^\./, '')           // strip a leading dot
    .split('.')
  // path = path
  //   .replace(/\[["'`]/g, '[')
  //   .replace(/["'`]\]/g, ']')
  //   .replace(/\].?\[/g, '.')
  // return path.split(/\./g)
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
  propertyPath: Array<PropertyKey> | PropertyKey
): boolean {
  return objAt(object, propertyPath)[1]
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
  ...propertyPaths: Array<Array<PropertyKey> | PropertyKey>
): boolean {
  if (!object) { return false } // Early exit
  for (const propertyPath of propertyPaths) {
    if (objAt(object, propertyPath)[1]) {
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
  ...propertyPaths: Array<Array<PropertyKey> | PropertyKey>
): boolean {
  if (!object) { return false } // Early exit
  for (const propertyPath of propertyPaths) {
    if (!objAt(object, propertyPath)[1]) {
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
 * @public
 */
export function objAt<T = unknown>(
  object: unknown,
  pathSegments: PropertyKey | Array<PropertyKey>
): [value: T, exists: boolean] {
  if (!object) { return [undefined, false] } // Early exit
  let valueRef: unknown = object
  if (!Array.isArray(pathSegments)) {
    pathSegments = getObjectPathSegments(String(pathSegments))
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
 * Gets a value inside a deeply nested object. This mutates the original object.
 * @param object - The object to act on.
 * @param path - Path to the value in the object
 * @param value - The value to set.
 * @public
 */
export function objSet(
  object: unknown,
  path: string,
  value: unknown
): void {
  let valueRef: unknown = object
  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    const isParentOfTarget = i === path.length - 1
    if (isParentOfTarget) {
      valueRef[key] = value
    } else {
      valueRef = hasProperty(valueRef, key) ? valueRef[key] : {}
    }
  }
}

// TODO: rename 'has-property' to 'property'
