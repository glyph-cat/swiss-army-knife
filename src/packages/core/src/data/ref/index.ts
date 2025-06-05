import { PossiblyUndefined } from '../../types'
import { Nullable } from '../nullable'

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
export function createRef<T>(value: T): RefObject<T>

/**
 * Alternative to React's `createRef`, for when a `RefObject` is needed in a non-React project.
 * @param value - The value assigned to the ref.
 * @returns A new `RefObject`.
 * @public
 */
export function createRef<T>(value: Nullable<T>): RefObject<Nullable<T>>

/**
 * Alternative to React's `createRef`, for when a `RefObject` is needed in a non-React project.
 * @param value - The value assigned to the ref.
 * @returns A new `RefObject`.
 * @public
 */
export function createRef<T>(value: PossiblyUndefined<T>): RefObject<PossiblyUndefined<T>>

export function createRef<T>(value: T): RefObject<T> {
  return { current: value }
}
