import { isNumber } from '../../../data/type-check'
import { HashFactory } from '../../../hash'
import { useRef } from '../lazy-ref'

let __numericComponentIdCounter__ = 0

const hashFactory = new HashFactory(8)

/**
 * @internal
 */
export function __idFactory__(
  idType: number | typeof String | typeof Number | typeof Symbol,
  minimumLength?: number
): () => PropertyKey {
  return () => {
    if (isNumber(idType)) {
      return hashFactory.create(idType) // as hash length
    } else if (Object.is(idType, String)) {
      return hashFactory.create(minimumLength || 4)
    } else if (Object.is(idType, Number)) {
      const hash = ++__numericComponentIdCounter__
      hashFactory.track(String(hash))
      return hash
    } else {
      return Symbol()
    }
  }
}

/**
 * Generates a hash-based component ID. Each generated hash is cached and
 * checked against every time a new one is generated to guarantee its
 * uniqueness, therefore, consumes more memory compared to using numbers or
 * symbol as component ID.
 *
 * NOTES:
 * - In React ≥18, prefer the `useId` hook available when possible, only use this
 *   hook when it doesn't work or if you just need some sort of hash-ish ID.
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
 * Generates a hash-based component ID. Each generated hash is cached and
 * checked against every time a new one is generated to guarantee its
 * uniqueness, therefore, consumes more memory compared to using numbers or
 * symbol as component ID.
 *
 * NOTES:
 * - Minimum length defaults to `4`.
 * - In React ≥18, prefer the `useId` hook available when possible, only use this
 *   hook when it doesn't work or if you just need some sort of hash-ish ID.
 * - The length of the string is automatically determined.
 * - The ID is persisted across renders.
 * - It will only be forgotten when a component unmounts.
 * - If the same component remounts, a new ID will be assigned.
 * @example
 * const componentId = useComponentId(String)
 * console.log(componentId) // 'k28f'
 * @public
 */
export function useComponentId(idType: typeof String, minimumLength?: number): string

/**
 * Generates a numeric component ID. To ensure uniqueness, IDs are generated
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
  idType: number | typeof String | typeof Number | typeof Symbol,
  minimumLength?: number
): PropertyKey {
  const id = useRef(__idFactory__(idType, minimumLength))
  // NOTE: Previously ids are untracked upon unmount but there are some problems:
  // - This produces problem in StrictMode as the incorrect id will be untracked
  // - It would still be a better practice if none of the ids are reused, even if
  //   the components using them are already unmounted.
  return id.current
}
