import { StrictPropertyKey } from '../../../types'
import { hasProperty } from '../has-property'

/**
 * Removes items from an object. This does not mutate the original object.
 * @param fromObject - Object to have the properties removed.
 * @param items - The keys of items to remove from the object.
 * @example
 * const obj = { foo: 1, bar: 2, baz: 3 }
 * const newObj = omit(obj, 'foo', 'bar')
 * console.log(newObj) // { baz: 3 }
 * @returns A new object with the specified items removed. The original object
 * remains untouched.
 * @public
 */
export function omit<SourceObject, Key extends StrictPropertyKey>(
  fromObject: SourceObject,
  ...items: [Key | keyof SourceObject, ...Array<Key | keyof SourceObject>]
  // NOTE: `keyof SourceObject` for autocomplete only
): Omit<SourceObject, Key> {
  let payload: Omit<SourceObject, Key> = fromObject
  for (const item of items) {
    if (!hasProperty(payload, item)) { continue }
    const { [item as Key]: _toOmit, ...remainingItems } = payload
    payload = remainingItems as Omit<SourceObject, Key>
  }
  return payload
}
