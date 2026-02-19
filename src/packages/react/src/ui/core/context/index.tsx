import { Nullable } from '@glyph-cat/foundation'
import { KeyChordManager } from '@glyph-cat/swiss-army-knife'
import { createContext, JSX, ReactNode, useContext, useMemo } from 'react'
import type { InputFocusTracker } from '../input-focus'
import type { PortalManager } from '../portal-factory'

/**
 * @public
 */
export interface ICoreUIContext {
  inputFocusTracker?: InputFocusTracker
  keyChordManager?: KeyChordManager
  portalManager?: PortalManager
}

const CoreUIContext = createContext<Nullable<ICoreUIContext>>(null)

/**
 * All components must be provided in the outermost provider.
 * In nested providers, these components are optional — the provider will
 * fallback to use components from its parent provider for any of the components
 * not provided.
 * @public
 */
export interface CoreUIProviderProps extends Partial<ICoreUIContext> {
  children?: ReactNode
}

/**
 * @public
 */
export function CoreUIProvider({
  children,
  inputFocusTracker,
  keyChordManager,
  portalManager,
}: CoreUIProviderProps): JSX.Element {
  const parentContext = useContext(CoreUIContext)
  const contextValue = useMemo(() => ({
    ...parentContext,
    inputFocusTracker,
    keyChordManager,
    portalManager,
  }), [inputFocusTracker, keyChordManager, parentContext, portalManager])
  return (
    <CoreUIContext.Provider value={contextValue}>
      {children}
    </CoreUIContext.Provider>
  )
}

/**
 * @public
 */
export function useCoreUIContext(): ICoreUIContext {
  const context = useContext(CoreUIContext)
  if (!context) {
    throw new Error('`useCoreUIContext` must be used within <CoreUIProvider>')
  }
  return context
}
