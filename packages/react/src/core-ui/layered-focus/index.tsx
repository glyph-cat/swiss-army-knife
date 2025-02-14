/* eslint-disable react-hooks/rules-of-hooks */
import { IDisposable, isNull, RefObject, TypedFunction } from '@glyph-cat/swiss-army-knife'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import {
  createContext,
  DependencyList,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { createRegistrationReducers, IFocusNode, IFocusNodeState } from './internals'

const DATA_FOCUSED = 'data-focused'

/**
 * @public
 */
export interface FocusRootProps {
  children: ReactNode
}

/**
 * @public
 */
export interface FocusLayerProps {
  ignoreSiblings?: boolean
  children: ReactNode
}

/**
 * @public
 */
export class LayeredFocusManager implements IDisposable {

  /**
   * @internal
   */
  private readonly M$rootState = new SimpleStateManager<IFocusNodeState>({
    id: null,
    ignoreSiblings: false,
    focusedChild: null,
    childNodes: {},
  })

  /**
   * @internal
   */
  private readonly M$context = createContext<IFocusNode>(null)

  constructor() {
    this.dispose = this.dispose.bind(this)
  }

  readonly FocusRoot = ({ children }: FocusRootProps): JSX.Element => {

    const state = useSimpleStateValue(this.M$rootState)

    const setFocus = useCallback((id: string) => {
      const [registerChild, unregisterChild] = createRegistrationReducers(id)
      this.M$rootState.set(registerChild)
      return () => { this.M$rootState.set(unregisterChild) }
    }, [])

    const nextContext = useMemo<IFocusNode>(() => ({
      ...state,
      parentNode: undefined,
      setFocus,
    }), [setFocus, state])

    return (
      <this.M$context.Provider value={nextContext}>
        {children}
      </this.M$context.Provider>
    )

  }

  readonly FocusLayer = ({
    ignoreSiblings,
    children,
  }: FocusLayerProps): JSX.Element => {

    const layerId = useId()
    const parentContext = useContext(this.M$context)
    const { setFocus: parentSetFocus } = parentContext
    useEffect(() => {
      if (!ignoreSiblings) {
        return parentSetFocus(layerId)
      }
    }, [ignoreSiblings, layerId, parentSetFocus])

    const [state, setState] = useState<IFocusNodeState>({
      id: layerId,
      ignoreSiblings,
      focusedChild: null,
      childNodes: {},
    })

    const nextSetFocus = useCallback((id: string) => {
      const [registerChildNode, unregisterChildNode] = createRegistrationReducers(id)
      setState(registerChildNode)
      return () => { setState(unregisterChildNode) }
    }, [])

    const nextContext = useMemo<IFocusNode>(() => ({
      ...state,
      parentNode: parentContext,
      setFocus: nextSetFocus,
    }), [parentContext, nextSetFocus, state])

    return (
      <this.M$context.Provider value={nextContext}>
        {children}
      </this.M$context.Provider>
    )

  }

  readonly useLayeredFocusState = (): [isFocused: boolean, layerId: string] => {
    const context = useContext(this.M$context)
    const isFocused = getFocusedStateFromContext(context)
    return [isFocused, context.id]
  }

  readonly useLayeredFocusEffect = (
    callback: TypedFunction,
    dependencies?: DependencyList,
  ): void => {
    const { useLayeredFocusState } = this
    const [isFocused] = useLayeredFocusState()
    useEffect(() => {
      if (isFocused) {
        return callback()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused, ...dependencies])
  }

  dispose(): void {
    this.M$rootState.dispose()
  }

  /**
   * @internal
   */
  readonly FocusObserver = ({
    allowRefocus,
    elementRef,
  }: FocusObserverProps): JSX.Element => {

    const context = useContext(this.M$context)
    const { id, parentNode, ignoreSiblings } = context

    const isFocused = getFocusedStateFromContext(context)
    useLayoutEffect(() => {
      if (isFocused) {
        const element = elementRef.current
        element.setAttribute(DATA_FOCUSED, String(isFocused))
        return () => { element.removeAttribute(DATA_FOCUSED) }
      }
    }, [elementRef, isFocused])

    // NOTE: Every <FocusLayer> will have a parent node.
    // In the most basic scenario, the parent will be the <FocusRoot>.
    // The only time when parent node is undefined is when trying to access
    // the <FocusRoot> directly, which is not how the <FocusObserver> is
    // meant to be used —— it should always be nested in a <FocusLayer>.
    const parentSetFocus = parentNode.setFocus
    useLayoutEffect(() => {
      if (!allowRefocus || ignoreSiblings) { return } // Early exit
      const onMouseDown = () => { parentSetFocus(id) }
      const target = elementRef.current
      target.addEventListener('mousedown', onMouseDown)
      return () => { target.removeEventListener('mousedown', onMouseDown) }
    }, [allowRefocus, elementRef, id, ignoreSiblings, parentSetFocus])

    return null

  }

}

interface FocusObserverProps {
  allowRefocus: boolean
  elementRef: RefObject<HTMLElement>
}

function getFocusedStateFromContext(context: IFocusNode): boolean {
  if (isNull(context.focusedChild) && context.parentNode) {
    return Object.is(context.parentNode.focusedChild, context.id) || context.ignoreSiblings
  } else {
    return true
  }
}
