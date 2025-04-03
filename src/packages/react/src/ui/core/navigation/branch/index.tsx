import {
  Children,
  ForwardedRef,
  forwardRef,
  JSX,
  ReactElement,
  ReactNode,
  useImperativeHandle,
  useState,
} from 'react'
import { ReactElementArray } from '../../../../types'
import { CoreNavigationId } from '../abstractions'
import {
  CoreNavigationBranchContext,
  CoreNavigationBranchItemContext,
} from '../constants'

/**
 * @public
 */
export interface CoreNavigationBranchProps {
  children?: ReactElementArray<CoreNavigationBranchItemProps>
  initialFocusedItem?: CoreNavigationId
}

/**
 * @public
 */
export interface CoreNavigationBranch {
  setFocus(id: CoreNavigationId): void
}

/**
 * @public
 */
export const CoreNavigationBranch = forwardRef(({
  children: $children,
}: CoreNavigationBranchProps, forwardedRef: ForwardedRef<CoreNavigationBranch>): JSX.Element => {
  const children = Children.toArray($children) as Array<ReactElement<CoreNavigationBranchItemProps>>
  const [focusedItemId, setFocusedItemId] = useState<CoreNavigationId>(children?.[0]?.key ?? null)
  useImperativeHandle(forwardedRef, () => ({ setFocus: setFocusedItemId }), [])
  return (
    <CoreNavigationBranchContext.Provider value={{ setFocus: setFocusedItemId }}>
      {children.reduce((acc, child) => {
        acc.push(
          <CoreNavigationBranchItemContext
            key={child.key}
            value={{ isFocused: focusedItemId === child.key }}
          >
            {child}
          </CoreNavigationBranchItemContext>
        )
        return acc
      }, [])}
    </CoreNavigationBranchContext.Provider>
  )
})

/**
 * @public
 */
export interface CoreNavigationBranchItemProps {
  children?: ReactNode
  key: string
}

/**
 * @public
 */
export function CoreNavigationBranchItem({
  children,
}: CoreNavigationBranchItemProps): JSX.Element {
  return <>{children}</>
}
