/* eslint-disable react-hooks/rules-of-hooks */
import { CleanupFunction, IDisposable } from '@glyph-cat/foundation'
import { deepRemove, deepSet, TruthRecord } from '@glyph-cat/swiss-army-knife'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { ComponentType, createElement, JSX, useEffect } from 'react'

/**
 * @public
 */
export interface LoadingCoverPseudoComponentProps {
  /**
   * @defaultValue `true`
   */
  visible?: boolean
}

/**
 * @public
 */
export class LoadingCoverFactory implements IDisposable {

  /**
   * @internal
   */
  private M$idCounter = 0

  /**
   * @internal
   */
  private readonly M$hooks = new SimpleStateManager<TruthRecord<number>>({})

  constructor(private readonly component: ComponentType<{ visible: boolean }>) {
    this.show = this.show.bind(this)
    this.dispose = this.dispose.bind(this)
  }

  show(): CleanupFunction {
    const id = ++this.M$idCounter
    this.M$hooks.set((s) => deepSet(s, [id], true))
    return () => { this.M$hooks.set((s) => deepRemove(s, [id])) }
  }

  Canvas = (): JSX.Element => {
    const visible = useSimpleStateValue(this.M$hooks, (s) => Object.keys(s).length > 0)
    return createElement(this.component, { visible })
  }

  PseudoComponent = ({
    visible = true,
  }: LoadingCoverPseudoComponentProps): JSX.Element => {
    useEffect(() => {
      if (!visible) { return } // Early exit
      return this.show()
    }, [visible])
    return null
  }

  dispose(): void {
    this.M$hooks.dispose()
  }

}
