import { GCObject } from '../../bases'
import { JSFunction } from '../../types'

/**
 * @public
 */
export type WatcherCallback<A extends Array<unknown>> = (...args: A) => void

/**
 * @public
 */
export type UnwatchCallback = JSFunction

/**
 * @public
 */
export interface WatcherStats {
  count: {
    /**
     * Number of callbacks that are still in effect.
     */
    active: number
    /**
     * Number of callbacks that have been unsubscribed from the {@link Watcher}.
     */
    expired: number
  }
}

/**
 * @public
 * @example
 */
export class Watcher<A extends Array<unknown>> extends GCObject {

  private M$watcherCollection: Record<number, CallableFunction> = {}
  private M$watchersAdded = 0
  private M$watchersRemoved = 0

  /**
   * @example
   * const myWatcher = new Watcher<[number]>()
   */
  constructor() {
    super()
  }

  /**
   * Accepts a callback and start watching for changes. The callback will be
   * invoked whenever a refresh is triggered.
   * @example
   * let totalScore = 0
   * const unwatch = myWatcher.watch((newScore: number) => {
   *   totalScore += newScore
   * })
   */
  watch(callback: WatcherCallback<A>): UnwatchCallback {
    this.M$watcherCollection[this.$id] = callback
    this.M$watchersAdded += 1
    const unwatch = (): void => {
      delete this.M$watcherCollection[this.$id]
      this.M$watchersRemoved += 1
    }
    return unwatch
  }

  /**
   * Forcecully remove all watchers.
   * @example
   * myWatcher.unwatchAll()
   */
  unwatchAll(): void {
    this.M$watcherCollection = {}
  }

  /**
   * Triggers a refresh.
   * * @example
   * myWatcher.refresh(42)
   */
  refresh(...args: A): void {
    const callbackStack = Object.values(this.M$watcherCollection)
    for (let i = 0; i < callbackStack.length; i++) {
      callbackStack[i](...args)
    }
  }

  /**
   * @example
   * const stats = myWatcher.getStats()
   * const [watchersAdded, watchersRemoved] = stats
   * @returns A object containing the number of watchers added and those that
   * have been removed.
   */
  getStats(): WatcherStats {
    return {
      count: {
        active: this.M$watchersAdded,
        expired: this.M$watchersRemoved,
      },
    }
  }

}

/**
 * @public
 */
export class AggregateWatcher<A extends Array<unknown>> extends Watcher<A> {

  private watchers: Array<Watcher<A>> = []
  private unwatchList: Array<UnwatchCallback> = []
  private _refresh: typeof this.refresh

  constructor(watchers: Array<Watcher<A>>) {
    super()
    this.watchers = watchers
    this._refresh = this.refresh
    this.refresh = () => {
      throw new Error('AggregateWatcher does not allow triggering refreshes externally')
    }
    for (const watcher of this.watchers) {
      const unwatch = watcher.watch((...args) => {
        this._refresh(...args)
      })
      this.unwatchList.push(unwatch)
    }
  }

  unwatchAll(): void {
    for (const unwatch of this.unwatchList) {
      unwatch()
    }
    super.unwatchAll()
  }

}
