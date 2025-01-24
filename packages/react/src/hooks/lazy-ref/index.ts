import { RefObject } from '@glyph-cat/swiss-army-knife'
import { useRef } from 'react'

/**
 * @public
 */
export function useLazyRef<T>(factory: (() => T)): RefObject<T> {
  const isInitialized = useRef(false)
  const refValue = useRef<T>(null)
  if (!isInitialized.current) {
    refValue.current = factory()
    isInitialized.current = true
  }
  return refValue
}
