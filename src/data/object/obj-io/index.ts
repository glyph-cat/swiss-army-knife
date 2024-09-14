import { hasProperty } from '../has-property'
import { EMPTY_OBJECT } from '../../dummies'

// todo: write tests

/**
 * Gets a value from a deeply nested object.
 * @param object - The source object
 * @param path - Path to the value in the object
 * @returns The deeply nested value if it exists, otherwise an EMPTY_OBJECT.
 * @public
 */
export function objAt(
  object: Record<PropertyKey, unknown>,
  path: Array<PropertyKey>
): unknown {
  let valueRef: unknown = object
  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    if (!hasProperty(valueRef, key)) {
      // todo: bad practice, we should have a function called `hasDeepProperty`
      return EMPTY_OBJECT // Early exit
    }
    valueRef = valueRef[key]
  }
  return valueRef
}

/**
 * Gets a value inside a deeply nested object. This mutates the original object.
 * @param object - The object to act on.
 * @param path - Path to the value in the object
 * @param value - The value to set.
 * @public
 */
export function objSet<O extends Record<PropertyKey, unknown>>(
  object: O,
  path: string,
  value: unknown
): void {
  let valueRef: unknown = object
  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    const isParentOfTarget = i === path.length - 1
    if (isParentOfTarget) {
      valueRef[key] = value
    } else {
      valueRef = hasProperty(valueRef, key) ? valueRef[key] : {}
    }
  }
}
