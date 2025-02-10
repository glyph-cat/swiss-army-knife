import { Nullable } from '@glyph-cat/swiss-army-knife'
import { createContext, createElement, JSX, ReactNode, useContext } from 'react'

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
export class DisabledContext {

  /**
   * @internal
   */
  private readonly M$Context = createContext<Nullable<boolean>>(null)

  readonly Provider = ({
    children,
    disabled,
  }: DisabledContextProviderProps): JSX.Element => {
    return createElement(this.M$Context.Provider, { value: disabled }, children)
  }

  readonly useDisabledContext = (): boolean => {
    return useContext(this.M$Context)
  }

  readonly useDerivedDisabledState = (disabled: boolean): boolean => {
    const { useDisabledContext } = this
    const ascendantDisabled = useDisabledContext()
    return ascendantDisabled ?? disabled
  }

}
