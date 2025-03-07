import { IDisposable, isString, RefObject, TypedFunction } from '@glyph-cat/swiss-army-knife'
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
  children: ReactNode
  /**
   * @defaultValue `false`
   */
  ignoreSiblings?: boolean
  /**
   * @defaultValue `true`
   */
  effective?: boolean
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

    const setFocus = useCallback((id: string, $ignoreSiblings: boolean) => {
      const [registerChild, unregisterChild] = createRegistrationReducers(id, $ignoreSiblings)
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
    children,
    ignoreSiblings,
    effective = true,
  }: FocusLayerProps): JSX.Element => {

    const layerId = useId()

    // NOTE: context is always expected to have a value in this scenario
    const parentContext = useContext(this.M$context)
    const { setFocus: parentSetFocus } = parentContext
    useEffect(() => {
      if (!effective) { return } // Early exit
      return parentSetFocus(layerId, ignoreSiblings)
    }, [effective, ignoreSiblings, layerId, parentSetFocus])

    const [state, setState] = useState<IFocusNodeState>({
      id: layerId,
      ignoreSiblings,
      focusedChild: null,
      childNodes: {},
    })

    const nextSetFocus = useCallback((id: string, $ignoreSiblings: boolean) => {
      const [registerChildNode, unregisterChildNode] = createRegistrationReducers(id, $ignoreSiblings)
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
    // NOTE: context is sometimes expected to NOT have a value in this scenario
    const context = useContext(this.M$context)
    const isFocused = getFocusedStateFromContext(context, false)
    return [isFocused, context?.id ?? null]
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
    elementRef,
    allowRefocus,
  }: FocusObserverProps): JSX.Element => {

    // NOTE: context is always expected to have a value in this scenario
    const context = useContext(this.M$context)
    const isFocused = getFocusedStateFromContext(context, true)
    const { id, parentNode, ignoreSiblings } = context

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
      const onMouseDown = () => { parentSetFocus(id, ignoreSiblings) }
      const target = elementRef.current
      target.addEventListener('mousedown', onMouseDown)
      return () => { target.removeEventListener('mousedown', onMouseDown) }
    }, [allowRefocus, elementRef, id, ignoreSiblings, parentSetFocus])

    return null

  }

}

interface FocusObserverProps {
  elementRef: RefObject<HTMLElement>
  allowRefocus: boolean
}

function getFocusedStateFromContext(
  context: IFocusNode,
  enforceContextPresence: boolean,
): boolean {
  if (!context && !enforceContextPresence) { return true } // Early exit
  if (isString(context.focusedChild)) { return false } // Early exit
  if (context.parentNode) {
    return Object.is(context.parentNode.focusedChild, context.id) || context.ignoreSiblings
    // Early exit
  }
  return true
}
