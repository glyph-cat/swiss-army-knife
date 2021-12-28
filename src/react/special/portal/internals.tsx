import { Children, ElementType, Fragment, ReactNode, useEffect } from 'react'
import { createSource, useRelinkValue } from 'react-relink'
import { devWarn } from '../../../dev'
import { useRef } from '../../hooks/lazy-ref'
import { PortalSet, PortalStateData, PORTAL_TYPE } from './schema'

/**
 * @internal
 */
function createPortalSet(): PortalSet {
  let portalIdCounter = 0

  const PortalSource = createSource<PortalStateData>({
    key: Symbol('Portal'),
    default: {},
    options: {
      mutable: true,
    },
  })

  const renderInPortal = async (
    element: ElementType,
    props: Record<string, unknown>,
    children?: ReactNode
  ): Promise<number> => {
    const portalId = ++portalIdCounter
    await PortalSource.set((scopedState) => {
      return {
        ...scopedState,
        [portalId]: {
          type: PORTAL_TYPE.params,
          element,
          props,
          children,
        },
      }
    })
    return portalId
  }

  const removeFromPortal = async (portalId: number): Promise<void> => {
    await PortalSource.set((scopedState) => {
      const {
        [portalId]: itemToExclude,
        ...remainingState
      } = scopedState
      return remainingState
    })
  }

  const Portal = ({ children }): JSX.Element => {
    // Only 1 children is allowed
    Children.only(children)
    const portalId = useRef(() => ++portalIdCounter)
    useEffect(() => {
      PortalSource.set((scopedState) => {
        return {
          ...scopedState,
          [portalId.current]: {
            children,
            type: PORTAL_TYPE.jsx,
          },
        }
      })
      const portalId_current = portalId.current
      return () => {
        PortalSource.set((scopedState) => {
          const {
            [portalId_current]: itemToExclude,
            ...remainingState
          } = scopedState
          return remainingState
        })
      }
    }, [children])
    return null
  }

  const Canvas = (): JSX.Element => {
    const portalState = useRelinkValue(PortalSource)
    const dataStack = Object.values(portalState)
    const renderStack = []
    for (const index in dataStack) {
      const data = dataStack[index]
      if (data.type === PORTAL_TYPE.jsx) {
        renderStack.push(
          <Fragment key={index}>
            {data.children}
          </Fragment>
        )
      } else if (data.type === PORTAL_TYPE.params) {
        const { element: Element, props, children = null } = data
        renderStack.push(
          <Element
            key={index}
            {...props}
          >
            {children}
          </Element>
        )
      } else {
        devWarn(`Unrecognized portal type '${data['type']}'`)
      }
    }
    return (
      <Fragment>
        {renderStack}
      </Fragment>
    )
  }

  return {
    Source: PortalSource,
    Canvas,
    Portal,
    renderInPortal,
    removeFromPortal,
  }
}

export default createPortalSet
