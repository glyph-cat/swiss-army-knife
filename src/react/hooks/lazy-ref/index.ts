import { RefObject, useRef as useRef_REACT } from 'react'
import { isFunction } from '../../../data/type-check'

const EMPTY_OBJECT = {} as const

/**
 * A drop-in replacement for React's built-in `useRef` hook but with additional
 * flexibility to lazily declare the variable.
 * @example
 * // Before
 * const animationRef = useRef()
 * if (!animationRef.current) {
 *   animationRef.current = new Animated.Value(0)
 * }
 * // After
 * useRef(() => new Animated.Value(0))
 *
 * // You can even create a factory function outside a component
 * const createAnimatedValue = () => new Animated.Value(0)
 * // Then use it like this
 * function SomeComponent() {
 *   useRef(createAnimatedValue)
 *   // ...
 * }
 * @public
 */
export function useRef<T>(
  valueOrFactory: T | (() => T) = null
): RefObject<T> {
  const mutableRefObj = useRef_REACT(EMPTY_OBJECT as T)
  if (Object.is(mutableRefObj.current, EMPTY_OBJECT)) {
    const initialValue = isFunction(valueOrFactory)
      ? (valueOrFactory as (() => T))()
      : valueOrFactory
    mutableRefObj.current = initialValue
  }
  return mutableRefObj
}
