import { createContext, createElement, JSX, ReactNode, useContext } from 'react'

/**
 * @public
 */
export const $DisabledContext = createContext<boolean>(false)

/**
 * @public
 */
export interface DisabledContextProps {
  children: ReactNode
  disabled: boolean
}

/**
 * @public
 */
export function DisabledContext({
  children,
  disabled,
}: DisabledContextProps): JSX.Element {
  return createElement($DisabledContext.Provider, { value: disabled }, children)
}

/**
 * @public
 */
export function useDisabledContext(): boolean {
  return useContext($DisabledContext)
}
