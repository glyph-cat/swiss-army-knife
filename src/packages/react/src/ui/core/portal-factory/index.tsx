import { CleanupFunction, devWarn, IDisposable } from '@glyph-cat/swiss-army-knife'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { Children, ElementType, Fragment, JSX, ReactNode, useEffect } from 'react'
import { useConstant } from '../../../hooks'
import { useCoreUIContext } from '../context'
import { IPortalFactoryState, PortalType } from './abstractions'

/**
 * @public
 */
export class PortalManager implements IDisposable {

  /**
   * @internal
   */
  private M$portalIdCounter = 0

  /**
   * @internal
   */
  readonly M$state = new SimpleStateManager<IPortalFactoryState>({})

  constructor() {
    this.render = this.render.bind(this)
    this.requestPortalId = this.requestPortalId.bind(this)
  }

  requestPortalId(): number {
    return ++this.M$portalIdCounter
  }

  render(
    element: ElementType,
    props: Record<string, unknown>,
    children?: ReactNode
  ): CleanupFunction {
    const portalId = this.requestPortalId()
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
    return () => {
      this.M$state.set((scopedState) => {
        const {
          [portalId]: itemToExclude,
          ...remainingState
        } = scopedState
        return remainingState
      })
    }
  }

  dispose(): void {
    this.M$state.dispose()
  }

}

/**
 * @public
 */
export interface PortalProps {
  children: ReactNode
}

/**
 * @public
 */
export function Portal({ children }: PortalProps): JSX.Element {
  Children.only(children)
  const { portalManager } = useCoreUIContext()
  const portalId = useConstant(portalManager.requestPortalId)
  useEffect(() => {
    if (!children) { return } // Early exit
    portalManager.M$state.set((scopedState) => {
      return {
        ...scopedState,
        [portalId]: {
          children,
          type: PortalType.JSX,
        },
      }
    })
    return () => {
      portalManager.M$state.set((scopedState) => {
        const {
          [portalId]: itemToExclude,
          ...remainingState
        } = scopedState
        return remainingState
      })
    }
  }, [children, portalId, portalManager.M$state])
  return null
}

export function PortalCanvas(): JSX.Element {
  const { portalManager } = useCoreUIContext()
  const portalState = useSimpleStateValue(portalManager.M$state)
  const renderStack = []
  for (const key in portalState) {
    const data = portalState[key]
    if (data.type === PortalType.JSX) {
      renderStack.push(
        <Fragment key={key}>
          {data.children}
        </Fragment>
      )
    } else if (data.type === PortalType.PARAMS) {
      const { element: Element, props, children = null } = data
      renderStack.push(
        <Element
          key={key}
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
