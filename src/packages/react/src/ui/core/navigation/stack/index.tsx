import { CleanupFunction, isNotEmptyObject } from '@glyph-cat/swiss-army-knife'
import {
  Children,
  createContext,
  createElement,
  JSX,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
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
export interface ICoreNavigationStack {
  isFocused: boolean
}

type ICoreNavigationStackContext = {
  __addDynamicChildren(id: CoreNavigationId, child: ReactElement<CoreNavigationStackItemProps>): CleanupFunction
}

type ICoreNavigationStackItemContext = Pick<ICoreNavigationStack, 'isFocused'> & {
  id: CoreNavigationId
}

const CoreNavigationStackContext = createContext<ICoreNavigationStackContext>(null)

const CoreNavigationStackItemContext = createContext<ICoreNavigationStackItemContext>(null)

/**
 * @public
 */
export function useCoreNavigationStack(): ICoreNavigationStack {
  const rootContext = useContext(CoreNavigationStackContext)
  const itemContext = useContext(CoreNavigationStackItemContext)
  return useMemo(() => ({
    ...rootContext,
    ...itemContext,
    isFocused: rootContext ? itemContext.isFocused : true,
  }), [itemContext, rootContext])
}

/**
 * @public
 */
export interface CoreNavigationStackProps {
  children?: ReactElementArray<CoreNavigationStackItemProps>
}

/**
 * @public
 */
export function CoreNavigationStack({
  children: $children,
}: CoreNavigationStackProps): JSX.Element {

  // VS Code could not tokenize it properly when written in one line in useState<...>
  type DynamicChildrenState = Record<CoreNavigationId, Record<CoreNavigationId, ReactElement<CoreNavigationStackItemProps>>>
  const [dynamicChildren, setDynamicChildren] = useState<DynamicChildrenState>({})

  const __addDynamicChildren = useCallback((
    referrerId: CoreNavigationId,
    child: ReactElement<CoreNavigationStackItemProps>,
  ) => {
    setDynamicChildren((s) => {
      const nextState = {
        ...s,
        [referrerId]: {
          ...s[referrerId],
          [child.props.id]: child,
        },
      }
      return nextState
    })
    return () => {
      setDynamicChildren((s) => {
        const { [referrerId]: _, ...nextState } = s
        return nextState
      })
    }
  }, [])

  const children = Children.toArray($children) as Array<ReactElement<CoreNavigationStackItemProps>>

  return (
    <CoreNavigationStackContext.Provider value={{ __addDynamicChildren }}>
      {children.reduce<Array<ReactElement<CoreNavigationStackItemProps>>>((acc, child) => {
        const currentItemId = child.props.id
        acc.push(child)
        if (isNotEmptyObject(dynamicChildren[currentItemId])) {
          acc.push(...Object.values(dynamicChildren[currentItemId]))
        }
        return acc
      }, []).reduce((acc, child, currentIndex, arr) => {
        if (__getTypeMarker(child.type) !== TypeMarker.CoreNavStackItem) {
          throw new Error(`${__getDisplayName(CoreNavigationStack)} only allows children of type ${__getDisplayName(CoreNavigationStackItem)}`)
        }
        const currentItemId = child.props.id
        const isLastItem = currentIndex === (arr.length - 1)
        acc.push(
          <CoreNavigationStackItemContext.Provider
            key={child.key}
            value={{
              isFocused: isLastItem,
              id: currentItemId
            }}
          >
            {createElement(child.type, {
              ...child.props,
              __isDirectItem: true,
              key: child.key,
            })}
          </CoreNavigationStackItemContext.Provider>
        )
        return acc
      }, [])}
    </CoreNavigationStackContext.Provider>
  )
}

__setDisplayName(CoreNavigationStack)

/**
 * @public
 */
export interface CoreNavigationStackItemProps {
  id: string
  children?: ReactNode
  /**
   * @internal
   */
  __isDirectItem?: boolean
  /**
   * @internal
   */
  __isBridgedDynamicItem?: boolean
}

/**
 * @public
 */
export function CoreNavigationStackItem({
  id,
  children,
  __isDirectItem,
  __isBridgedDynamicItem,
}: CoreNavigationStackItemProps): JSX.Element {
  if (__isDirectItem || __isBridgedDynamicItem) {
    return <>{children}</>
  } else {
    return (
      <CoreNavigationStackDynamicItem id={id}>
        {children}
      </CoreNavigationStackDynamicItem>
    )
  }
}

interface CoreNavigationStackDynamicItemProps {
  id: CoreNavigationId
  children: ReactNode
}

function CoreNavigationStackDynamicItem({
  id,
  children,
}: CoreNavigationStackDynamicItemProps): JSX.Element {
  const { __addDynamicChildren } = useContext(CoreNavigationStackContext)
  const { id: referrerId } = useContext(CoreNavigationStackItemContext)
  useEffect(() => {
    // KIV: This should've caused problems in Strict Mode, but apparently is not.
    // 1. Add id to `{}`
    // 2. Set same id on `{ [id]: ... }`
    // 3. Remove id from `{ [id]: ... }`
    // 4. Remove id from `{}`
    // If problems do occur, we can try to use an array and push values to circumvent this
    // since we're using a context after all.
    return __addDynamicChildren(referrerId, createElement(CoreNavigationStackItem, {
      id,
      __isBridgedDynamicItem: true,
    }, children))
  }, [__addDynamicChildren, children, id, referrerId])
  return null
}

__setDisplayName(CoreNavigationStackItem)
__setTypeMarker(CoreNavigationStackItem, TypeMarker.CoreNavStackItem)
