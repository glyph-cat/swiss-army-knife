import {
  Children,
  createContext,
  ForwardedRef,
  forwardRef,
  JSX,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import {
  __getDisplayName,
  __getTypeMarker,
  __setDisplayName,
  __setTypeMarker,
  TypeMarker,
} from '../../../../_internals'
import { ReactElementArray } from '../../../../types'
import { CoreNavigationId } from '../abstractions'

/**
 * @public
 */
export interface ICoreNavigationBranch {
  setFocus(id: CoreNavigationId): void
  focusNext(): void
  focusPrev(): void
  isFocused: boolean
  isFirstItem: boolean
  isLastItem: boolean
}

type ICoreNavigationBranchContext = Pick<ICoreNavigationBranch, 'setFocus' | 'focusNext' | 'focusPrev'>

type ICoreNavigationBranchItemContext = Pick<ICoreNavigationBranch, 'isFocused' | 'isFirstItem' | 'isLastItem'>

const CoreNavigationBranchContext = createContext<ICoreNavigationBranchContext>(null)

const CoreNavigationBranchItemContext = createContext<ICoreNavigationBranchItemContext>(null)

/**
 * @public
 */
export function useCoreNavigationBranch(): ICoreNavigationBranch {
  const rootContext = useContext(CoreNavigationBranchContext)
  const itemContext = useContext(CoreNavigationBranchItemContext)
  return useMemo(() => ({
    ...rootContext,
    ...itemContext,
    isFocused: rootContext ? itemContext.isFocused : true,
  }), [itemContext, rootContext])
}

/**
 * @public
 */
export interface CoreNavigationBranchProps {
  children?: ReactElementArray<CoreNavigationBranchItemProps>
  focusedItem?: CoreNavigationId
}

/**
 * @public
 */
export interface CoreNavigationBranch {
  setFocus(id: CoreNavigationId): void
  focusNext(): void
  focusPrev(): void
}

/**
 * @public
 */
export const CoreNavigationBranch = forwardRef(({
  children: $children,
  focusedItem,
}: CoreNavigationBranchProps, forwardedRef: ForwardedRef<CoreNavigationBranch>): JSX.Element => {

  const children = Children.toArray($children) as Array<ReactElement<CoreNavigationBranchItemProps>>

  const [focusedItemId, setFocusedItemId] = useState(focusedItem ?? children?.[0]?.key)

  const focusNext = useCallback(() => {
    setFocusedItemId(($focusedItemId) => {
      const currentIndex = children.findIndex((child) => child.key === $focusedItemId)
      const targetIndex = Math.min(currentIndex + 1, children.length - 1)
      return children[targetIndex].key
    })
  }, [children])

  const focusPrev = useCallback(() => {
    setFocusedItemId(($focusedItemId) => {
      const currentIndex = children.findIndex((child) => child.key === $focusedItemId)
      const targetIndex = Math.min(currentIndex - 1, children.length - 1)
      return children[targetIndex].key
    })
  }, [children])

  useImperativeHandle(forwardedRef, () => ({
    setFocus: setFocusedItemId,
    focusNext,
    focusPrev,
  }), [focusNext, focusPrev])

  return (
    <CoreNavigationBranchContext.Provider value={useMemo(() => ({
      focusedItem: focusedItemId,
      setFocus: setFocusedItemId,
      focusNext,
      focusPrev,
      itemsCount: children.length,
    }), [children.length, focusNext, focusPrev, focusedItemId])}>
      {children.reduce((acc, child, currentIndex, arr) => {
        if (__getTypeMarker(child.type) !== TypeMarker.CoreNavBranchItem) {
          throw new Error(`${__getDisplayName(CoreNavigationBranch)} only allows children of type ${CoreNavigationBranchItem.name}`)
        }
        acc.push(
          <CoreNavigationBranchItemContext
            key={child.key}
            value={{
              isFocused: focusedItem === child.key,
              isFirstItem: currentIndex === 0,
              isLastItem: currentIndex === (arr.length - 1),
            }}
          >
            {child}
          </CoreNavigationBranchItemContext>
        )
        return acc
      }, [])}
    </CoreNavigationBranchContext.Provider>
  )
})

__setDisplayName(CoreNavigationBranch)

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

__setDisplayName(CoreNavigationBranchItem)
__setTypeMarker(CoreNavigationBranchItem, TypeMarker.CoreNavBranchItem)
