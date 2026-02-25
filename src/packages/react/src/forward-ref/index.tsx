import { ForwardedRef, forwardRef, ReactNode, Ref, useImperativeHandle, useRef } from 'react'

// This helps avoid using `mergeRefs` to intercept the props and reconstruct the ReactElement.

// For React Native, mergeRefs is the only possible way.
// But for HTML, under what circumstances should we use mergeRefs?
// Is it possible to combine in the same component and dynamically pick a strategy?
// `mergeRefs` prop?

/**
 * @public
 */
export interface ForwardProps<T> {
  ref?: Ref<T>
  children?: ReactNode
}

/**
 * @public
 */
export const Forward = forwardRef(function Forward<T>(
  { children }: ForwardProps<T>,
  ref: ForwardedRef<T>,
): ReactNode {
  const leadingRef = useRef<HTMLDivElement>(null)
  const trailingRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => {
    const candidate = leadingRef.current?.nextElementSibling
    if (!candidate) { return null as T }
    if (Object.is(candidate, trailingRef.current)) { return null as T }
    if (!Object.is(candidate.nextElementSibling, trailingRef.current)) {
      // Log error, but still allow first candidate to be used.
      console.error(`<Forward> should have only one DOM element child (near: ${(candidate.nodeName || candidate.tagName)?.toLowerCase() || String(candidate)})`)
    }
    return candidate as T
  }, [])
  return (
    <>
      {/* eslint-disable-next-line react/forbid-elements */}
      <div ref={leadingRef} style={{ display: 'none' }} />
      {children}
      {/* eslint-disable-next-line react/forbid-elements */}
      <div ref={trailingRef} style={{ display: 'none' }} />
    </>
  )
})
