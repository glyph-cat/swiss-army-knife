/**
 * @public
 */
export type RefObject<T> = { current: T }

/**
 * Alternative to React's `createRef`, for when a `RefObject` is needed in a non-React project.
 * @param value - The value assigned to the ref.
 * @returns A new `RefObject`.
 * @public
 */
export function createRef<T>(value: T): RefObject<T> {
  return { current: value }
}
