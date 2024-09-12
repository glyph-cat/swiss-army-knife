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
    if (hasProperty(object, propertyName)) {
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
    if (!hasProperty(object, propertyName)) {
      return false
    }
  }
  return false
}

// TODO: `hasDeepProperty`
// export function hasDeepProperty(
//   object: unknown,
//   pathToPropertyName: PropertyKey
// ): boolean {
//   return
// }
