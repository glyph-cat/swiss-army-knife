import {
  addStyles,
  clientOnly,
  isObject,
  Nullable,
  PrecedenceLevel,
  RefObject,
  StyleMap,
} from '@glyph-cat/swiss-army-knife'
import {
  createContext,
  ForwardedRef,
  forwardRef,
  JSX,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { View } from '../ui'

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
export const SizeAwareContext = createContext<Nullable<ResizeObserverEntry>>(null)

/**
 * @public
 */
export const ProbeView = forwardRef((_, probeRef: ForwardedRef<View>): JSX.Element => {
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
export type SizeAwareHandle = [
  probeRef: RefObject<View>,
  bounds: Nullable<ResizeObserverEntry>,
]

/**
 * @public
 */
export function useSizeAwareHandle(): SizeAwareHandle {
  const [bounds, setBounds] = useState<Nullable<ResizeObserverEntry>>(null)
  const probeRef = useRef<View>(null)
  useEffect(() => {
    const target = probeRef.current
    if (!target) { return } // Early exit
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        setBounds(entries[0])
      }
    })
    resizeObserver.observe(target)
    return () => { resizeObserver.disconnect() }
  }, [])
  return [probeRef, bounds]
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
}: SizeAwareContainerProps): JSX.Element {
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
export function useSizeAwareContext(): Nullable<ResizeObserverEntry> {
  return useContext(SizeAwareContext)
}

// #endregion Convenience APIs
