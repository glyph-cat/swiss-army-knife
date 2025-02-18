import { devWarn, IDisposable } from '@glyph-cat/swiss-army-knife'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { Children, ElementType, Fragment, JSX, ReactNode, useEffect, useState } from 'react'
import { IPortalFactoryState, PortalType } from './abstractions'

/**
 * @public
 */
export interface PortalProps {
  children: ReactNode
}

/**
 * @public
 */
export class PortalFactory implements IDisposable {

  /**
   * @internal
   */
  private M$portalIdCounter = 0

  /**
   * @internal
   */
  private M$state = new SimpleStateManager<IPortalFactoryState>({})

  constructor() {
    this.remove = this.remove.bind(this)
    this.render = this.render.bind(this)
  }

  render(
    element: ElementType,
    props: Record<string, unknown>,
    children?: ReactNode
  ): number {
    const portalId = ++this.M$portalIdCounter
    this.M$state.set((currentState) => {
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
    this.M$state.set((scopedState) => {
      const {
        [portalId]: itemToExclude,
        ...remainingState
      } = scopedState
      return remainingState
    })
  }

  Portal = ({ children }: PortalProps): JSX.Element => {
    // Only 1 children is allowed
    Children.only(children)
    const [portalId] = useState(() => ++this.M$portalIdCounter)
    useEffect(() => {
      this.M$state.set((scopedState) => {
        return {
          ...scopedState,
          [portalId]: {
            children,
            type: PortalType.JSX,
          },
        }
      })
      const portalId_current = portalId
      return () => {
        this.M$state.set((scopedState) => {
          const {
            [portalId_current]: itemToExclude,
            ...remainingState
          } = scopedState
          return remainingState
        })
      }
    }, [children, portalId])
    return null
  }

  Canvas = (): JSX.Element => {
    const portalState = useSimpleStateValue(this.M$state)
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

  dispose(): void {
    this.M$state.dispose()
  }

}
