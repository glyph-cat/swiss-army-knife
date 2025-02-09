import { hasProperty } from '../property'

/**
 * From T, pick a set of properties whose keys are in the union K.
 * This does not mutate the original object.
 * @param fromObject - The object to pick from.
 * @param keys - The keys to of items to pick from the object.
 * @returns A new object with only the picked properties.
 * @example
 * const obj = { foo: 1, bar: 2, baz: 3 }
 * const newObj = Pick(obj, ['foo', 'bar'])
 * console.log(newObj) // { foo: 1, bar: 2 }
 * @public
 */
export function Pick<SourceObject, Key extends keyof SourceObject>(
  fromObject: SourceObject,
  keys: Array<Key>,
): Pick<SourceObject, Key> {
  const payload = {} as Pick<SourceObject, Key>
  for (const key of keys) {
    if (!hasProperty(fromObject, key)) { continue }
    payload[key] = fromObject[key]
  }
  return payload
}
