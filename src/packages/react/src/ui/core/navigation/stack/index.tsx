import { CleanupFunction } from '@glyph-cat/swiss-army-knife'
import {
  Children,
  createContext,
  JSX,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
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
  insert(/* todo */): CleanupFunction
  isFocused: boolean
}

type ICoreNavigationStackItemContext = Pick<ICoreNavigationStack, 'isFocused'>

type ICoreNavigationStackContext = Pick<ICoreNavigationStack, 'insert'>

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

  const [dynamicItems, setDynamicItems] = useState([])
  const remove = useCallback((id: CoreNavigationId) => {
    setDynamicItems(s => {
      const nextDynamicItems = [...s]
      nextDynamicItems.splice(nextDynamicItems.indexOf(id))
      return nextDynamicItems
    })
  }, [])
  const insert = useCallback(() => {
    const newId: CoreNavigationId = null
    setDynamicItems(s => [...s, null]) // TODO
    return () => { remove(newId) }
  }, [remove])

  const children = Children.toArray($children) as Array<ReactElement<CoreNavigationStackItemProps>>

  return (
    <CoreNavigationStackContext.Provider value={{ insert }}>
      {children.reduce((acc, child, currentIndex, arr) => {
        if (__getTypeMarker(child.type) !== TypeMarker.CoreNavStackItem) {
          throw new Error(`${__getDisplayName(CoreNavigationStack)} only allows children of type ${CoreNavigationStackItem.name}`)
        }
        const isLastItem = currentIndex === (arr.length - 1)
        acc.push(
          <CoreNavigationStackItemContext.Provider
            key={child.key}
            value={{ isFocused: isLastItem }}
          >
            {child}
          </CoreNavigationStackItemContext.Provider>
        )
        return acc
      }, [])}
      {dynamicItems}
    </CoreNavigationStackContext.Provider>
  )
}

__setDisplayName(CoreNavigationStack)

/**
 * @public
 */
export interface CoreNavigationStackItemProps {
  children?: ReactNode
  key: string
}

/**
 * @public
 */
export function CoreNavigationStackItem({
  children,
}: CoreNavigationStackItemProps): JSX.Element {
  return <>{children}</>
}

__setDisplayName(CoreNavigationStackItem)
__setTypeMarker(CoreNavigationStackItem, TypeMarker.CoreNavStackItem)
