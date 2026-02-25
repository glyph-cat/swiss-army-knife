/* eslint-disable */
import { CleanupFunction } from '@glyph-cat/foundation'
import { DependencyList, useEffect, useRef } from 'react'

function useDebouncedEffect(callback: () => void | CleanupFunction, deps: DependencyList): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null!)
  useEffect(() => {
    const cleanup = callback()
    clearTimeout(timeoutRef.current)
    return () => {
      timeoutRef.current = setTimeout(() => {
        cleanup?.()
      })
    }
  }, [...deps])
}

function useDebouncedCleanup(callback: () => void, deps: DependencyList): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null!)
  useEffect(() => {
    clearTimeout(timeoutRef.current)
    return () => {
      timeoutRef.current = setTimeout(() => { callback() })
    }
  }, [...deps])
}

export { }
