import { isObject } from '../../type-check'
import { hasProperty } from '../has-property'

/**
 * Flattens objects until they have one layer of depth only.
 * @author penguinboy
 * @see https://gist.github.com/penguinboy/762197 (adapted)
 * @param object The data to be flattened.
 * @returns The flattened object
 * @public
 */
export function getFlattenedObject(
  object: Record<number | string, unknown>
): Record<number | string, unknown> {
  const toReturn = {}
  for (const key in object) {
    if (!hasProperty(object, key)) { continue }
    if (isObject(object[key])) {
      const flatObject = getFlattenedObject(object[key] as typeof object)
      // NOTE: `as typeof object` is needed otherwise will get the following error:
      // > Argument of type 'unknown' is not assignable to parameter of type
      // > 'Record<string | number, unknown>'.
      for (const subKey in flatObject) {
        if (!hasProperty(flatObject, subKey)) { continue }
        toReturn[key + '.' + subKey] = flatObject[subKey]
      }
    } else {
      toReturn[key] = object[key]
    }
  }
  return toReturn
}
