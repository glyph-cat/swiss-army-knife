import { useEffect } from 'react'
import { lazyDeclare } from '../../../data/lazy-declare'
import { createTruthMap } from '../../../data/truth-map'
import { isNumber, isString } from '../../../data/type-check'
import { getRandomHash } from '../../../random/hash'
import { JSObjectKey } from '../../../types'
import { useRef } from '../lazy-ref'

/**
 * @internal
 */
let __numericComponentIdCounter__ = 0

/**
 * @internal
 */
const __hashTracker__ = lazyDeclare(() => createTruthMap<string>())

/**
 * @internal
 */
function __idFactory__(
  idType: number | typeof Number | typeof Symbol
): () => JSObjectKey {
  return () => {
    if (isNumber(idType)) {
      let hash: string
      do {
        hash = getRandomHash(idType) // as hash length
      } while (__hashTracker__.get().has(hash))
      __hashTracker__.get().add(hash)
      return hash
    } else if (Object.is(idType, Number)) {
      return ++__numericComponentIdCounter__
    } else {
      return Symbol()
    }
  }
}

/**
 * Generates a hash-based component ID. Each genarated hash is cached and
 * checked against every time a new one is generated to guarantee its
 * uniqueness, therefore, consumes more memory compared to using numbers or
 * symbol as component ID.
 *
 * NOTES:
 * - The ID is persisted across renders.
 * - It will only be forgotten when a component unmounts.
 * - If the same component remounts, a new ID will be assigned.
 * @example
 * const componentId = useComponentId(8)
 * console.log(componentId) // 'y28vVlQG'
 * @public
 */
export function useComponentId(hashLength: number): string

/**
 * Generates a numeric component ID. To ensure uniqueness, IDs are genarated
 * from a global counter that increases by `1` each time a new one is requested.
 *
 * NOTES:
 * - The ID is persisted across renders.
 * - It will only be forgotten when a component unmounts.
 * - If the same component remounts, a new ID will be assigned.
 * @example
 * const componentId = useComponentId(Number)
 * console.log(componentId) // 1
 * @public
 */
export function useComponentId(idType: typeof Number): number

/**
 * Generates a symbolic component ID. Uniqueness of ID is guaranteed by nature.
 *
 * NOTES:
 * - The ID is persisted across renders.
 * - It will only be forgotten when a component unmounts.
 * - If the same component remounts, a new ID will be assigned.
 * @example
 * const componentId = useComponentId(Symbol)
 * console.log(componentId) // Symbol()
 * @public
 */
export function useComponentId(idType: typeof Symbol): symbol

/**
 * @public
 */
export function useComponentId(
  idType: number | typeof Number | typeof Symbol
): JSObjectKey {
  const id = useRef(__idFactory__(idType))
  useEffect(() => {
    return () => {
      if (isString(idType)) {
        __hashTracker__.get().remove(id as unknown as string)
      }
    }
  }, [idType])
  return id.current
}
