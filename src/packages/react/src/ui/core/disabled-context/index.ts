import { Nullable } from '@glyph-cat/swiss-army-knife'
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
export function useDisabledContext(): boolean {
  return useContext(BaseContext)
}

/**
 * @public
 */
export function useDerivedDisabledState(disabled: boolean): boolean {
  const ascendantDisabled = useDisabledContext()
  return disabled ?? ascendantDisabled
}
