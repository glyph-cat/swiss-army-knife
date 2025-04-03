import { ReactElementArray } from '@glyph-cat/swiss-army-knife-react'
import { Children, JSX, ReactElement, ReactNode, useCallback, useState } from 'react'
import { CoreNavigationId } from '../abstractions'
import { CoreNavigationStackContext, CoreNavigationStackItemContext } from '../constants'

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
  children: children,
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
    setDynamicItems(s => [...s, null])
    return () => { remove(newId) }
  }, [remove])

  return (
    <CoreNavigationStackContext.Provider value={{ insert }}>
      {(Children.toArray(children) as Array<ReactElement<CoreNavigationStackItemProps>>).reduce((
        acc,
        child,
        currentIndex,
        arr,
      ) => {
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
