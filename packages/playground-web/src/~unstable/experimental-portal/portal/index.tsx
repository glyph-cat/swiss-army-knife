import { CleanupFunction, Nullable, NumericRecord } from '@glyph-cat/foundation'
import { IS_DEBUG_ENV, objectMap } from '@glyph-cat/swiss-army-knife'
import { createContext, Fragment, Key, ReactElement, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
// import { __getDisplayName, __setDisplayName } from '../../_internals'

// —————————————————————————————————————————————————————————————————————————————

export interface IExperimentalPortalContext {
  (content: ReactNode, key?: Key): CleanupFunction
}

export const ExperimentalPortalContext = createContext<Nullable<IExperimentalPortalContext>>(null)

export function useExperimentalPortal(): IExperimentalPortalContext {
  const renderInPortal = useContext(ExperimentalPortalContext)
  if (!renderInPortal) {
    throw new Error('`usePortal` must be used within <PortalProvider>')
  }
  return renderInPortal
}

// —————————————————————————————————————————————————————————————————————————————

type ContentKeyPair = [content: ReactNode, key: Key]

export interface ExperimentalPortalProviderProps {
  children?: ReactNode
  // /**
  //  * @defaultValue `<React.Fragment />`
  //  */
  // container?: ReactElement
}

export function ExperimentalPortalProvider({
  children,
  // container,
}: ExperimentalPortalProviderProps): ReactNode {

  const renderKeyGeneratorCounter = useRef(0)
  const [state, setState] = useState<NumericRecord<ContentKeyPair>>({})

  const renderInPortal = useCallback((content: ReactNode, key?: Key): CleanupFunction => {
    const id = ++renderKeyGeneratorCounter.current
    setState((prevState) => ({
      ...prevState,
      [id]: [content, key] as ContentKeyPair,
    }))
    return () => {
      setState((prevState) => {
        const { [id]: _, ...nextState } = prevState
        return nextState
      })
    }
  }, [])

  // const {
  //   type: Container,
  //   props: { children: containerChildren, ...containerProps },
  //   key: containerKey,
  // } = container ?? <></>

  // if (IS_DEBUG_ENV && containerChildren) {
  //   console.error(`[${__getDisplayName(PortalProvider)}] Container should not have children. Children will be ignored:`, containerChildren)
  // }

  return (
    <ExperimentalPortalContext.Provider value={renderInPortal}>
      {children}
      {/* <Container key={containerKey} {...containerProps}>
      </Container> */}
      {objectMap(state, ([content, renderKey], id) => (
        <Fragment key={renderKey ?? id}>
          {content}
        </Fragment>
      ))}
    </ExperimentalPortalContext.Provider>
  )

}

// __setDisplayName(ExperimentalPortalProvider)

// —————————————————————————————————————————————————————————————————————————————

export interface ExperimentalPortalProps {
  children?: ReactNode
  renderKey?: Nullable<Key>
  container?: Nullable<Element | DocumentFragment>
}

export function ExperimentalPortal({
  children,
  renderKey,
  container,
}: ExperimentalPortalProps): ReactNode {

  const renderInPortal = useContext(ExperimentalPortalContext)
  const shouldUseContext = renderInPortal && !container

  useEffect(() => {
    if (shouldUseContext) {
      return renderInPortal(children)
    }
  }, [children, renderInPortal, shouldUseContext])

  if (shouldUseContext) { return null } // Early exit
  return createPortal(children, container ?? document.body, renderKey)

}

// —————————————————————————————————————————————————————————————————————————————

// export function staticRenderInPortal(
//   content: ReactNode,
//   container: Element | DocumentFragment,
//   key?: Key,
// ): CleanupFunction {
//   return () => { }
// }

// TODO: add imperative method for showing/hiding portal
