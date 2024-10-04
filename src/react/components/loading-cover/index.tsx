import { ComponentType, JSX, useEffect, useState } from 'react'
import { TruthMap } from '../../../data/indexing'
import { Watcher } from '../../../events/watcher'

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
  show(): (() => void)
}

/**
 * @public
 */
export function createLoadingCover(
  config: LoadingCoverConfig
): LoadingCoverSet {

  let idCounter = 0
  const hookers: TruthMap<number> = {}
  const watcher = new Watcher()

  const show = (): (() => void) => {
    const id = ++idCounter
    hookers[id] = true
    watcher.refresh()
    return () => {
      delete hookers[id]
      watcher.refresh()
    }
  }

  const Component = (): JSX.Element => {
    const LoadingCoverComponent = config.component
    const [isVisible, setVisibility] = useState(false)
    useEffect(() => {
      const unwatch = watcher.watch(() => {
        const shouldBeVisible = Object.keys(hookers).length > 0
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
