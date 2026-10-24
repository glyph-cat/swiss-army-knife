import { StrictPropertyKey } from '@glyph-cat/foundation'
import { objectIsNotEmpty } from '../data'

/**
 * The sole purpose is to check for duplicate values only.
 * @public
 */
export function asEnum<T>(definition: T): Readonly<T> {
  const reversedLookup = new Map<T[keyof T], Array<keyof T>>()
  for (const key in definition) {
    const value = definition[key]
    let list = reversedLookup.get(value)
    if (!list) {
      list = []
      reversedLookup.set(value, list)
    }
    list.push(key)
  }
  const reversedLookupEntries = [...reversedLookup.entries()]
  const valuesWithMultipleKeys = reversedLookupEntries.reduce((acc, [value, keys]) => {
    if (keys.length > 1) {
      acc[value as StrictPropertyKey] = keys
    }
    return acc
  }, {} as Record<StrictPropertyKey, Array<keyof T>>)
  if (objectIsNotEmpty(valuesWithMultipleKeys)) {
    throw new Error(`Enums should not have duplicate values: ${JSON.stringify(valuesWithMultipleKeys).replace(/^{/, '{ ').replace(/}$/, ' }').replace(/],"/g, '], "')}`)
  }
  return definition
}
