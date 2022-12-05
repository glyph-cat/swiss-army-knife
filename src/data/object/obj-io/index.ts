import { hasProperty } from '../has-property'
import { EMPTY_OBJECT } from '../../dummies'

export function objAt(
  object: Record<PropertyKey, unknown>,
  path: Array<PropertyKey>
): unknown {
  let valueRef: unknown = object
  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    if (!hasProperty(valueRef, key)) {
      return EMPTY_OBJECT // Early exit
    }
    valueRef = valueRef[key]
  }
  return valueRef
}

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
