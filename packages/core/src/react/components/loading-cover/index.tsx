import { ComponentType, JSX, useEffect, useState } from 'react'
import { TruthRecord } from '../../../data/indexing'
import { Watcher } from '../../../events/watcher'
import { CleanupFunction } from '../../../types'

/**
 * @public
 */
export interface LoadingCoverConfig {
  component: ComponentType<{ isVisible: boolean }>
}

/**
 * @public
 */
export interface LoadingCoverSet {
  Component(): JSX.Element
  PseudoComponent(): JSX.Element
  show(): CleanupFunction
}

/**
 * @public
 */
export function createLoadingCover(
  config: LoadingCoverConfig
): LoadingCoverSet {

  let idCounter = 0
  const hooks: TruthRecord<number> = {}
  const watcher = new Watcher()

  const show = (): CleanupFunction => {
    const id = ++idCounter
    hooks[id] = true
    watcher.refresh()
    return () => {
      delete hooks[id]
      watcher.refresh()
    }
  }

  const Component = (): JSX.Element => {
    const LoadingCoverComponent = config.component
    const [isVisible, setVisibility] = useState(false)
    useEffect(() => {
      const unwatch = watcher.watch(() => {
        const shouldBeVisible = Object.keys(hooks).length > 0
        setVisibility(shouldBeVisible)
      })
      return () => { unwatch() }
    }, [])
    return <LoadingCoverComponent isVisible={isVisible} />
  }

  const PseudoComponent = (): JSX.Element => {
    useEffect(() => {
      const hide = show()
      return () => { hide() }
    }, [])
    return null
  }

  return {
    Component,
    PseudoComponent,
    show,
  }

}
