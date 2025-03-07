import { isFunction } from '@glyph-cat/swiss-army-knife'
import { useRef } from 'react'

/**
 * @public
 */
export function useConstant<T>(valueOrFactory: T | (() => T)): T {
  const isInitialized = useRef(false)
  const value = useRef<T>(null)
  if (!isInitialized.current) {
    if (isFunction(valueOrFactory)) {
      value.current = valueOrFactory()
    } else {
      value.current = valueOrFactory
    }
    isInitialized.current = true
  }
  return value.current
}
