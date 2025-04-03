import { ReactElementArray } from '@glyph-cat/swiss-army-knife-react'
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
import { VirtualNavigationId } from '../abstractions'
import {
  VirtualNavigationBranchContext,
  VirtualNavigationBranchItemContext,
} from '../constants'

/**
 * @public
 */
export interface VirtualNavigationBranchProps {
  children?: ReactElementArray<VirtualNavigationBranchItemProps>
  initialFocusedItem?: VirtualNavigationId
}

/**
 * @public
 */
export interface VirtualNavigationBranch {
  setFocus(id: VirtualNavigationId): void
}

/**
 * @public
 */
export const VirtualNavigationBranch = forwardRef(({
  children: $children,
}: VirtualNavigationBranchProps, forwardedRef: ForwardedRef<VirtualNavigationBranch>): JSX.Element => {
  const children = Children.toArray($children) as Array<ReactElement<VirtualNavigationBranchItemProps>>
  const [focusedItemId, setFocusedItemId] = useState<VirtualNavigationId>(children?.[0]?.key ?? null)
  useImperativeHandle(forwardedRef, () => ({ setFocus: setFocusedItemId }), [])
  return (
    <VirtualNavigationBranchContext.Provider value={{ setFocus: setFocusedItemId }}>
      {children.reduce((acc, child) => {
        acc.push(
          <VirtualNavigationBranchItemContext
            key={child.key}
            value={{ isFocused: focusedItemId === child.key }}
          >
            {child}
          </VirtualNavigationBranchItemContext>
        )
        return acc
      }, [])}
    </VirtualNavigationBranchContext.Provider>
  )
})

/**
 * @public
 */
export interface VirtualNavigationBranchItemProps {
  children?: ReactNode
  key: string
}

/**
 * @public
 */
export function VirtualNavigationBranchItem({
  children,
}: VirtualNavigationBranchItemProps): JSX.Element {
  return <>{children}</>
}
