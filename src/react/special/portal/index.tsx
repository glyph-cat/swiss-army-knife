import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { Children, ElementType, Fragment, ReactNode, useEffect } from 'react'
import { devWarn } from '../../../dev'
import { useRef } from '../../hooks/lazy-ref'
import { IPortalFactoryState, PortalType } from './schema'

/**
 * @public
 */
export class PortalFactory {

  private portalIdCounter = 0

  private state = new SimpleStateManager<IPortalFactoryState>({})

  render(
    element: ElementType,
    props: Record<string, unknown>,
    children?: ReactNode
  ): number {
    const portalId = ++this.portalIdCounter
    this.state.set((currentState) => {
      return {
        ...currentState,
        [portalId]: {
          type: PortalType.PARAMS,
          element,
          props,
          children,
        },
      }
    })
    return portalId
  }

  remove(portalId: number): void {
    this.state.set((scopedState) => {
      const {
        [portalId]: itemToExclude,
        ...remainingState
      } = scopedState
      return remainingState
    })
  }

  Portal = ({ children }: { children: ReactNode }): JSX.Element => {
    // Only 1 children is allowed
    Children.only(children)
    const portalId = useRef(() => ++this.portalIdCounter)
    useEffect(() => {
      this.state.set((scopedState) => {
        return {
          ...scopedState,
          [portalId.current]: {
            children,
            type: PortalType.JSX,
          },
        }
      })
      const portalId_current = portalId.current
      return () => {
        this.state.set((scopedState) => {
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

  Canvas = (): JSX.Element => {
    const portalState = useSimpleStateValue(this.state)
    const dataStack = Object.values(portalState)
    const renderStack = []
    for (const index in dataStack) {
      const data = dataStack[index]
      if (data.type === PortalType.JSX) {
        renderStack.push(
          <Fragment key={index}>
            {data.children}
          </Fragment>
        )
      } else if (data.type === PortalType.PARAMS) {
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
    return <>{renderStack}</>
  }

}