import { TypedFunction } from '@glyph-cat/foundation'

/**
 * @public
 */
export type WatcherCallback<A extends Array<unknown>> = TypedFunction<A, void>

/**
 * @public
 */
export type UnwatchCallback = TypedFunction<[], void>

/**
 * @public
 * @deprecated
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
 * const myWatcher = new Watcher<[number]>()
 */
export class Watcher<A extends Array<unknown>> {

  /**
   * @internal
   */
  private M$watcherCollection: Record<number, CallableFunction> = {}

  /**
   * @internal
   */
  private M$watchersAdded = 0

  /**
   * @internal
   */
  private M$watchersRemoved = 0

  /**
   * @internal
   */
  private M$counter = 0

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
    const currentSubscriberId = ++this.M$counter
    this.M$watcherCollection[currentSubscriberId] = callback
    this.M$watchersAdded += 1
    const unwatch = (): void => {
      if (!this.M$watcherCollection[currentSubscriberId]) { return } // Early exit
      delete this.M$watcherCollection[currentSubscriberId]
      this.M$watchersRemoved += 1
    }
    return unwatch
  }

  // KIV
  // watchOnce(callback: WatcherCallback<A>): UnwatchCallback {
  //   const unwatch = this.watch((...args) => {
  //     callback(...args)
  //     unwatch()
  //   })
  //   return unwatch
  // }

  /**
   * Forcefully remove all watchers.
   * @example
   * myWatcher.unwatchAll()
   */
  unwatchAll(): void {
    const currentWatcherCount = Object.keys(this.M$watcherCollection).length
    this.M$watcherCollection = {}
    this.M$watchersRemoved += currentWatcherCount
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
   * @deprecated
   */
  get stats(): WatcherStats {
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
 * @deprecated
 */
export class AggregateWatcher<A extends Array<unknown>> extends Watcher<A> {

  private watchers: Array<Watcher<A>> = []
  private unwatchList: Array<UnwatchCallback> = []

  /**
   * @internal
   */
  private M$refresh: typeof this.refresh

  constructor(watchers: Array<Watcher<A>>) {
    super()
    this.watchers = watchers
    this.M$refresh = this.refresh
    this.refresh = () => {
      throw new Error('AggregateWatcher does not allow triggering refreshes externally')
    }
    for (const watcher of this.watchers) {
      const unwatch = watcher.watch((...args) => {
        this.M$refresh(...args)
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
