import { ReactElementArray } from '@glyph-cat/swiss-army-knife-react'
import { Children, JSX, ReactElement, ReactNode, useCallback, useState } from 'react'
import { VirtualNavigationId } from '../abstractions'
import { VirtualNavigationStackContext, VirtualNavigationStackItemContext } from '../constants'

/**
 * @public
 */
export interface VirtualNavigationStackProps {
  children?: ReactElementArray<VirtualNavigationStackItemProps>
}

/**
 * @public
 */
export function VirtualNavigationStack({
  children: children,
}: VirtualNavigationStackProps): JSX.Element {

  const [dynamicItems, setDynamicItems] = useState([])
  const remove = useCallback((id: VirtualNavigationId) => {
    setDynamicItems(s => {
      const nextDynamicItems = [...s]
      nextDynamicItems.splice(nextDynamicItems.indexOf(id))
      return nextDynamicItems
    })
  }, [])
  const insert = useCallback(() => {
    const newId: VirtualNavigationId = null
    setDynamicItems(s => [...s, null])
    return () => { remove(newId) }
  }, [remove])

  return (
    <VirtualNavigationStackContext.Provider value={{ insert }}>
      {(Children.toArray(children) as Array<ReactElement<VirtualNavigationStackItemProps>>).reduce((
        acc,
        child,
        currentIndex,
        arr,
      ) => {
        const isLastItem = currentIndex === (arr.length - 1)
        acc.push(
          <VirtualNavigationStackItemContext.Provider
            key={child.key}
            value={{ isFocused: isLastItem }}
          >
            {child}
          </VirtualNavigationStackItemContext.Provider>
        )
        return acc
      }, [])}
      {dynamicItems}
    </VirtualNavigationStackContext.Provider>
  )
}

/**
 * @public
 */
export interface VirtualNavigationStackItemProps {
  children?: ReactNode
  key: string
}

/**
 * @public
 */
export function VirtualNavigationStackItem({
  children,
}: VirtualNavigationStackItemProps): JSX.Element {
  return <>{children}</>
}
