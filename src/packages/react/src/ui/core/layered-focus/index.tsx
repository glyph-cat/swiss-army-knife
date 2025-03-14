import { IDisposable, TypedFunction } from '@glyph-cat/swiss-army-knife'
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
  useMemo,
  useState,
} from 'react'
import { useCoreUIContext } from '../context'
import { getFocusedStateFromContext } from './internals/observer'
import {
  createRegistrationReducers,
  IFocusNode,
  IFocusNodeState,
} from './internals/registration-reducers'

/**
 * @public
 */
export interface FocusRootProps {
  children?: ReactNode
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
  readonly M$rootState = new SimpleStateManager<IFocusNodeState>({
    id: null,
    ignoreSiblings: false,
    focusedChild: null,
    childNodes: {},
  })

  /**
   * @internal
   */
  readonly M$context = createContext<IFocusNode>(null)

  constructor() {
    this.dispose = this.dispose.bind(this)
  }

  dispose(): void {
    this.M$rootState.dispose()
  }

}

/**
 * @public
 */
export function FocusRoot({ children }: FocusRootProps): JSX.Element {

  const { layeredFocusManager } = useCoreUIContext()

  const state = useSimpleStateValue(layeredFocusManager.M$rootState)

  const setFocus = useCallback((id: string, $ignoreSiblings: boolean) => {
    const [registerChild, unregisterChild] = createRegistrationReducers(id, $ignoreSiblings)
    layeredFocusManager.M$rootState.set(registerChild)
    return () => { layeredFocusManager.M$rootState.set(unregisterChild) }
  }, [layeredFocusManager.M$rootState])

  const nextContext = useMemo<IFocusNode>(() => ({
    ...state,
    parentNode: undefined,
    setFocus,
  }), [setFocus, state])

  return (
    <layeredFocusManager.M$context.Provider value={nextContext}>
      {children}
    </layeredFocusManager.M$context.Provider>
  )

}

/**
 * @public
 */
export function FocusLayer({
  children,
  ignoreSiblings,
  effective = true,
}: FocusLayerProps): JSX.Element {

  const { layeredFocusManager } = useCoreUIContext()

  const layerId = useId()

  // NOTE: context is always expected to have a value in this scenario
  const parentContext = useContext(layeredFocusManager.M$context)
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
    <layeredFocusManager.M$context.Provider value={nextContext}>
      {children}
    </layeredFocusManager.M$context.Provider>
  )

}

/**
 * @public
 */
export function useLayeredFocusState(): [isFocused: boolean, layerId: string] {
  const { layeredFocusManager } = useCoreUIContext()
  // NOTE: context is sometimes expected to NOT have a value in this scenario
  const context = useContext(layeredFocusManager.M$context)
  const isFocused = getFocusedStateFromContext(context, false)
  return [isFocused, context?.id ?? null]
}

/**
 * @public
 */
export function useLayeredFocusEffect(
  callback: TypedFunction,
  dependencies?: DependencyList,
): void {
  const [isFocused] = useLayeredFocusState()
  useEffect(() => {
    if (isFocused) {
      return callback()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, ...dependencies])
}
