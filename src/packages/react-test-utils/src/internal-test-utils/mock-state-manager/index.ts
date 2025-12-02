import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { Watcher } from '../watcher'

// NOTE: Adapted from 'cotton-box'.

export class MockStateManager<State> {

  /**
   * @internal
   */
  protected readonly M$watcher = new Watcher<[State]>()

  /**
   * @internal
   */
  protected M$internalState: State

  constructor(defaultState: State, cleanupManager: CleanupManager) {
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.watch = this.watch.bind(this)
    this.unwatchAll = this.unwatchAll.bind(this)
    this.wait = this.wait.bind(this)
    this.dispose = this.dispose.bind(this)
    this.M$internalState = defaultState
    cleanupManager.append(this.dispose)
  }

  get(): State {
    return this.M$internalState
  }

  set(newState: State): void {
    this.M$internalState = newState
    this.M$watcher.refresh(this.M$internalState)
  }

  watch(callback: (state: State) => void): () => void {
    return this.M$watcher.watch(callback)
  }

  unwatchAll(): void {
    this.M$watcher.unwatchAll()
  }

  wait(expectedValue: State): Promise<State> {
    const fulfillsCondition = ($state: State) => Object.is(expectedValue, $state)
    if (fulfillsCondition(this.M$internalState)) {
      return Promise.resolve(this.M$internalState)
    } else {
      return new Promise((resolve) => {
        const unwatch = this.M$watcher.watch((state) => {
          if (fulfillsCondition(state)) {
            unwatch()
            resolve(state)
          }
        })
      })
    }
  }

  dispose(): void {
    this.M$watcher.dispose()
  }

}
