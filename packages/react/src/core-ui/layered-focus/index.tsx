/* eslint-disable react-hooks/rules-of-hooks */
import {
  deepRemove,
  deepSet,
  IDisposable,
  pickLast,
  TruthRecord,
  TypedFunction,
} from '@glyph-cat/swiss-army-knife'
import { ReadOnlyStateManager, SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import {
  createContext,
  DependencyList,
  JSX,
  ReactNode,
  useContext,
  useEffect,
  useId,
} from 'react'

const LayeredFocusIdContext = createContext<string>(undefined)

/**
 * @public
 */
export interface FocusLayerProps {
  children?: ReactNode
}

/**
 * @public
 */
export class LayeredFocusManager implements IDisposable {

  /**
   * @internal
   */
  M$state = new SimpleStateManager<TruthRecord>({})

  get state(): ReadOnlyStateManager<TruthRecord> { return this.M$state }

  constructor() {
    this.dispose = this.dispose.bind(this)
  }

  readonly FocusLayer = ({ children }: FocusLayerProps): JSX.Element => {
    const layerId = useId()
    useEffect(() => {
      this.M$state.set((s) => deepSet(s, [layerId], true))
      return () => { this.M$state.set((s) => deepRemove(s, [layerId])) }
    }, [layerId])
    return (
      <LayeredFocusIdContext.Provider value={layerId}>
        {children}
      </LayeredFocusIdContext.Provider>
    )
  }

  readonly useLayeredFocusState = (): [isFocused: boolean, layerId: string] => {
    const layerId = useContext(LayeredFocusIdContext)
    const isFocused = useSimpleStateValue(
      this.state,
      (s) => Object.is(layerId, pickLast(Object.keys(s)))
    )
    return [isFocused, layerId]
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
    this.M$state.dispose()
  }

}
