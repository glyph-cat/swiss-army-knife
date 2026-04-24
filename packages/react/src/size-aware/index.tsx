import { addStyles, PrecedenceLevel, StyleMap } from '@glyph-cat/css-utils'
import { Nullable, NullableRefObject } from '@glyph-cat/foundation'
import { clientOnly, RectangularBoundary } from '@glyph-cat/swiss-army-knife'
import { isObject } from '@glyph-cat/type-checking'
import {
  createContext,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { View } from '../ui/core/components/view'

const SIZE_AWARE_VIEW_PROBE_STYLES = 'size-aware-view-probe'

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${SIZE_AWARE_VIEW_PROBE_STYLES}`, {
      height: '100%',
      pointerEvents: 'none',
      position: 'absolute',
      width: '100%',
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})

/**
 * @public
 */
export const SizeAwareContext = createContext<Nullable<RectangularBoundary>>(null)

/**
 * @public
 */
export const ProbeView = forwardRef((_, probeRef: ForwardedRef<View>): ReactNode => {
  return (
    <View
      ref={probeRef}
      className={SIZE_AWARE_VIEW_PROBE_STYLES}
    />
  )
})

/**
 * @public
 */
export type ISizeAwareHandle = [
  probeRef: NullableRefObject<View>,
  bounds: Nullable<RectangularBoundary>,
]

/**
 * @public
 */
export function useSizeAwareHandle(): ISizeAwareHandle {
  const [bounds, setBounds] = useState<Nullable<RectangularBoundary>>(null)
  const probeRef = useRef<View>(null)
  useEffect(() => {
    const target = probeRef.current
    if (!target) { return } // Early exit
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        setBounds(null)
        return // Early exit
      }
      const newBounds = entry.target.getBoundingClientRect()?.toJSON()
      if (newBounds) {
        setBounds({
          height: newBounds.height,
          left: newBounds.left,
          top: newBounds.top,
          width: newBounds.width,
        })
      } else {
        setBounds(null)
      }
    })
    resizeObserver.observe(target)
    return () => { resizeObserver.disconnect() }
  }, [])
  return useMemo(() => ([
    probeRef,
    bounds,
  ]), [bounds])
}

// #region Convenience APIs

/**
 * @public
 */
export interface SizeAwareContainerProps {
  children?: ReactNode
}

/**
 * @public
 */
export function SizeAwareContainer({
  children,
}: SizeAwareContainerProps): ReactNode {
  const [probeRef, bounds] = useSizeAwareHandle()
  return (
    <>
      <ProbeView ref={probeRef} />
      {isObject(bounds) && (
        <SizeAwareContext value={bounds}>
          {children}
        </SizeAwareContext>
      )}
    </>
  )
}

/**
 * @public
 */
export function useSizeAwareContext(): RectangularBoundary {
  const context = useContext(SizeAwareContext)
  if (!context) {
    throw new Error('`useSizeAwareContext` can only be used within a <SizeAwareContext> or <SizeAwareContainer>')
  }
  return context
}

// #endregion Convenience APIs
