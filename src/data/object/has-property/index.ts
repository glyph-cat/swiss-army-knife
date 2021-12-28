/**
 * Checks if a property exists in an object.
 * @param obj The object to check.
 * @param propertyName Name of property to check.
 * @returns A boolean on whether the property exists or not.
 * @example
 * hasProperty({ 'foo': 'bar' }, 'foo') // true
 * hasProperty({ 'foo': 'bar' }, 'whooosh') // false
 * @public
 */
export function hasProperty(
  obj: unknown,
  propertyName: string | number | symbol
): boolean {
  return Object.prototype.hasOwnProperty.call(obj, propertyName)
}
