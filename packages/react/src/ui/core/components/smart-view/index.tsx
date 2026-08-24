import { createContext, ForwardedRef, forwardRef, ReactNode, useContext, useMemo } from 'react'
import { __setDisplayName } from '../../../../_internals'
import { View, ViewProps } from '../view'

// #region Context

/**
 * @deprecated This will be removed with no replacements due to diminishing returns and complexity.
 */
export interface ISmartViewContext {
  level: number
}

const SmartViewContext = createContext<ISmartViewContext>({
  level: 0
})

/**
 * @deprecated This will be removed with no replacements due to diminishing returns and complexity.
 */
export function useSmartViewContext(): ISmartViewContext {
  return useContext(SmartViewContext)
}

// #endregion Context

// #region Component

/**
 * @deprecated This will be removed with no replacements due to diminishing returns and complexity.
 */
export type SmartViewProps = ViewProps

/**
 * @deprecated This will be removed with no replacements due to diminishing returns and complexity.
 */
export interface SmartView extends View { (props: ViewProps): ReactNode }

/**
 * @deprecated This will be removed with no replacements due to diminishing returns and complexity.
 */
export const SmartView = forwardRef((
  props: SmartViewProps,
  ref: ForwardedRef<SmartView>,
): ReactNode => {

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
