import { createContext, createElement, JSX, ReactNode, useContext } from 'react'

const BaseContext = createContext<boolean | null | undefined>(null)

/**
 * @public
 */
export interface DisabledContextProviderProps {
  children?: ReactNode
  disabled: boolean | null | undefined
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
export function useDisabledContext(): boolean | null | undefined {
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
