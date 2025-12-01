import { CleanupFunction, StringRecord } from '@glyph-cat/swiss-army-knife'
import { JSX, ReactNode, useMemo } from 'react'
import { useMountedState } from '../hooks/deferral'
import { GCContext } from './context'
import { getContext } from './context/get'

export { GCContext } from './context'

/**
 * @internal
 */
export interface IGCContext {
  M$initializerStore: StringRecord<Array<[unknown, CleanupFunction]>>
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
