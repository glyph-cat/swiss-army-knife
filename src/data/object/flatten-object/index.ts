import { StrictRecord } from '../../../types'
import { isObject } from '../../type-check'
import { hasProperty } from '../has-property'

/**
 * Flattens objects until they have one layer of depth only.
 * @author penguinboy
 * @see https://gist.github.com/penguinboy/762197 (adapted)
 * @param object - The data to be flattened.
 * @returns The flattened object
 * @public
 */
export function getFlattenedObject(
  object: StrictRecord
): StrictRecord {
  const toReturn = {}
  for (const key in object) {
    if (!hasProperty(object, key)) { continue }
    if (isObject(object[key])) {
      const flatObject = getFlattenedObject(object[key])
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
