import { CleanupFunction, isFunction, RefObject } from '@glyph-cat/swiss-army-knife'
import { useCallback } from 'react'

/**
 * @public
 */
export function useMergedRefs<T>(
  ...refs: Array<RefObject<T> | ((node: T) => void | CleanupFunction)>
): ReturnType<typeof mergeRefs> {
  return useCallback((node: T) => {
    return mergeRefs(...refs)(node)
  }, [refs])
}

/**
 * @public
 */
export function mergeRefs<T>(
  ...refs: Array<RefObject<T> | ((node: T) => void | CleanupFunction)>
): (node: T) => CleanupFunction {
  return (node: T) => {
    for (const ref of refs) {
      if (isFunction(ref)) {
        ref(node)
      } else {
        ref.current = node
      }
    }
    return () => {
      // References:
      // - https://react.dev/reference/react-dom/components/common#react-19-added-cleanup-functions-for-ref-callbacks
      // - https://react.dev/reference/react-dom/components/common#react-19-added-cleanup-functions-for-ref-callbacks
      for (const ref of refs) {
        if (isFunction(ref)) {
          ref(null)
        } else {
          ref.current = null
        }
      }
    }
  }
}
