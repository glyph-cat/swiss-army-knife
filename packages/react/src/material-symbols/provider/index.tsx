import { JSX, ReactNode, useContext } from 'react'
import { MaterialSymbolOptions } from '../abstractions'
import { MaterialSymbolOptionsContext } from './internal'

/**
 * @public
 */
export interface MaterialSymbolsProviderProps extends Partial<MaterialSymbolOptions> {
  children?: ReactNode
}

/**
 * A Provider for the {@link MaterialSymbol} component. The {@link MaterialSymbolOptions}
 * props passed to this Provider will be inherited by all `<MaterialSymbol/>`
 * components that are nested within.
 * @public
 */
export function MaterialSymbolsProvider({
  children,
  ...otherProps
}: MaterialSymbolsProviderProps): JSX.Element {
  const ctx = useContext(MaterialSymbolOptionsContext)
  return (
    <MaterialSymbolOptionsContext.Provider
      value={{ ...ctx, ...otherProps }}>
      {children}
    </MaterialSymbolOptionsContext.Provider>
  )
}
