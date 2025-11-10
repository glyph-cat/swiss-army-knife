import { hasProperty } from '../property'

/**
 * Removes items from an object. This does not mutate the original object.
 * @param fromObject - Object to have the properties removed.
 * @param keys - The keys of items to remove from the object.
 * @returns A new object with the specified items removed.
 * @example
 * const obj = { foo: 1, bar: 2, baz: 3 }
 * const newObj = Omit(obj, 'foo', 'bar')
 * console.log(newObj) // { baz: 3 }
 * @public
 */
export function Omit<SourceObject, Key extends PropertyKey>(
  fromObject: SourceObject,
  keys: [Key | keyof SourceObject, ...Array<Key | keyof SourceObject>],
  // NOTE: `keyof SourceObject` for autocomplete only
): Omit<SourceObject, Key> {
  let payload: Omit<SourceObject, Key> = fromObject
  for (const key of keys) {
    if (!hasProperty(payload, key as string)) { continue }
    const { [key as Key]: _toOmit, ...remainingItems } = payload
    payload = remainingItems as Omit<SourceObject, Key>
  }
  return payload
}
