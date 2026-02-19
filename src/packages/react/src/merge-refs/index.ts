import { arrayIsShallowEqual } from '@glyph-cat/equality'
import { CleanupFunction, Nullable, NullableRefObject } from '@glyph-cat/foundation'
import { isFunction } from '@glyph-cat/type-checking'
import { useMemoAlt } from '../hooks'

/**
 * @public
 */
export function useMergedRefs<T>(
  ...refs: Array<NullableRefObject<T> | ((node: Nullable<T>) => void | CleanupFunction)>
): ReturnType<typeof mergeRefs<T>> {
  return useMemoAlt(
    () => mergeRefs(...refs),
    [refs],
    ([previousRefs], [nextRefs]) => arrayIsShallowEqual(previousRefs, nextRefs),
  )
}

/**
 * @public
 */
export function mergeRefs<T>(
  ...refs: Array<NullableRefObject<T> | ((node: Nullable<T>) => void | CleanupFunction)>
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
      // Reference: https://react.dev/reference/react-dom/components/common#react-19-added-cleanup-functions-for-ref-callbacks
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
