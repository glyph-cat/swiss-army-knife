import { createContext, ForwardedRef, forwardRef, JSX, useContext, useMemo } from 'react'
import { __setDisplayName } from '../../../../_internals'
import { View, ViewProps } from '../view'

// #region Context

/**
 * @public
 */
export interface ISmartViewContext {
  level: number
}

const SmartViewContext = createContext<ISmartViewContext>({
  level: 0
})

/**
 * @public
 */
export function useSmartViewContext(): ISmartViewContext {
  return useContext(SmartViewContext)
}

// #endregion Context

// #region Component

/**
 * @public
 */
export type SmartViewProps = ViewProps

/**
 * @public
 */
export interface SmartView extends View { (props: ViewProps): JSX.Element }

/**
 * @public
 */
export const SmartView = forwardRef((
  props: SmartViewProps,
  ref: ForwardedRef<SmartView>,
): JSX.Element => {

  const currentContext = useContext(SmartViewContext)

  const nextContext = useMemo(() => ({
    ...currentContext,
    level: currentContext.level + 1,
  }), [currentContext])

  return (
    <SmartViewContext.Provider value={nextContext}>
      <View ref={ref} {...props} />
    </SmartViewContext.Provider>
  )

})

__setDisplayName(SmartView)

// #endregion Component
