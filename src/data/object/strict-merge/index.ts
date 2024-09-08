import { hasProperty } from '../has-property'

/**
 * Similar to ordinary spread, except the final output object will only contain
 * properties that are present in the defaultObject.
 * @param defaultObject - The template object.
 * @param objectsToMerge - The other objects to spread on top of the default one.
 * @returns The merged object.
 * @public
 */
export function strictMerge<T>(defaultObject: T, ...objectsToMerge: Array<unknown>): T {
  let finalObject: T = defaultObject
  for (const nextObjectToMerge of objectsToMerge) {
    for (const key in defaultObject) {
      if (hasProperty(nextObjectToMerge, key)) {
        finalObject = {
          ...finalObject,
          [key]: (nextObjectToMerge as Partial<T>)[key],
        }
      }
    }
  }
  return finalObject
}
