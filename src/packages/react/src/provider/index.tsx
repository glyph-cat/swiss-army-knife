import { CleanupFunction, StringRecord } from '@glyph-cat/foundation'
import { JSX, ReactNode, useMemo } from 'react'
import { useMountedState } from '../hooks/deferral'
import { GCContext } from './context'
import { getContext } from './context/get'

export { GCContext } from './context'

/**
 * @internal
 */
export interface IGCContext {
  /**
   * @internal
   */
  M$initializerStore: StringRecord<Array<[unknown, CleanupFunction]>>
  /**
   * @internal
   */
  M$isHydrated: boolean
}

/**
 * @public
 */
export interface GCProviderProps {
  children?: ReactNode
}

/**
 * @public
 */
export function GCProvider({ children }: GCProviderProps): JSX.Element {
  const isMounted = useMountedState()
  const contextValue = useMemo(() => getContext(isMounted), [isMounted])
  return (
    <GCContext.Provider value={contextValue}>
      {children}
    </GCContext.Provider>
  )
}
