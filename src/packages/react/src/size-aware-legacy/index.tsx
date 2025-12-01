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
 * @deprecated
 */
export const SizeAwareContextLegacy = createContext<Nullable<ResizeObserverEntry>>(null)

/**
 * @public
 * @deprecated
 */
export const ProbeViewLegacy = forwardRef((_, probeRef: ForwardedRef<View>): JSX.Element => {
  return (
    <View
      ref={probeRef}
      className={SIZE_AWARE_VIEW_PROBE_STYLES}
    />
  )
})

/**
 * @public
 * @deprecated
 */
export type SizeAwareHandleLegacy = [
  probeRef: RefObject<View>,
  bounds: Nullable<ResizeObserverEntry>,
]

/**
 * @public
 * @deprecated
 */
export function useSizeAwareHandleLegacy(): SizeAwareHandleLegacy {
  const [bounds, setBounds] = useState<Nullable<ResizeObserverEntry>>(null)
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
      setBounds({
        ...entry,
        contentRect: {
          ...entry.contentRect,
          ...entry.target.getBoundingClientRect()?.toJSON(),
        },
      })
    })
    resizeObserver.observe(target)
    return () => { resizeObserver.disconnect() }
  }, [])
  return [probeRef, bounds]
}

// #region Convenience APIs

/**
 * @public
 * @deprecated
 */
export interface SizeAwareContainerLegacyProps {
  children?: ReactNode
}

/**
 * @public
 * @deprecated
 */
export function SizeAwareContainerLegacy({
  children,
}: SizeAwareContainerLegacyProps): JSX.Element {
  const [probeRef, bounds] = useSizeAwareHandleLegacy()
  return (
    <>
      <ProbeViewLegacy ref={probeRef} />
      {isObject(bounds) && (
        <SizeAwareContextLegacy value={bounds}>
          {children}
        </SizeAwareContextLegacy>
      )}
    </>
  )
}

/**
 * @public
 * @deprecated
 */
export function useSizeAwareContextLegacy(): Nullable<ResizeObserverEntry> {
  return useContext(SizeAwareContextLegacy)
}

// #endregion Convenience APIs
