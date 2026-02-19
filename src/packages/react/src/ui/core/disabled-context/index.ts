import { Nullable } from '@glyph-cat/foundation'
import { createContext, createElement, JSX, ReactNode, useContext } from 'react'

const BaseContext = createContext<Nullable<boolean>>(null)

/**
 * @public
 */
export interface DisabledContextProviderProps {
  children?: ReactNode
  disabled: Nullable<boolean>
}

/**
 * @public
 */
export function DisabledContext({
  children,
  disabled,
}: DisabledContextProviderProps): JSX.Element {
  return createElement(BaseContext.Provider, { value: disabled }, children)
}

/**
 * @public
 */
export function useDisabledContext(): Nullable<boolean> {
  return useContext(BaseContext)
}

/**
 * @public
 */
export function useDerivedDisabledState(
  disabled: boolean | null | undefined,
): boolean {
  const ascendantDisabled = useDisabledContext()
  return Boolean(disabled ?? ascendantDisabled)
}
