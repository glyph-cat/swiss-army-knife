import { StrictPropertyKey } from '../../../types'
import { isObject } from '../../type-check'
import { hasProperty } from '../property'

/**
 * @see https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3
 * @public
 */
export type FlattenedKeyOf<ObjectType extends object> =
  { [Key in keyof ObjectType & StrictPropertyKey]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${FlattenedKeyOf<ObjectType[Key]>}`
    : `${Key}`
  }[keyof ObjectType & StrictPropertyKey]

/**
 * Flattens objects until they have one layer of depth only.
 * @author penguinboy
 * @see https://gist.github.com/penguinboy/762197 (adapted)
 * @param object - The data to be flattened.
 * @returns The flattened object
 * @public
 */
export function getFlattenedObject<T extends object>(
  object: T
): Record<FlattenedKeyOf<T>, unknown> {
  const payload = {} as Record<FlattenedKeyOf<T>, unknown>
  for (const key in object) {
    if (!hasProperty(object, key)) { continue }
    if (isObject(object[key])) {
      const flatObject = getFlattenedObject(object[key])
      for (const subKey in flatObject) {
        if (!hasProperty(flatObject, subKey)) { continue }
        payload[key + '.' + subKey] = flatObject[subKey]
      }
    } else {
      payload[key as FlattenedKeyOf<T>] = object[key]
    }
  }
  return payload
}
