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
 * @example abc
 */
export class Watcher<A extends Array<unknown>> extends GCObject {

  private incrementalWatchId = 0
  private watcherCollection: Record<number, CallableFunction> = {}

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
    const newId = ++this.incrementalWatchId
    this.watcherCollection[newId] = callback
    const unwatch = (): void => {
      delete this.watcherCollection[newId]
    }
    return unwatch
  }

  /**
   * Forcecully remove all watchers.
   * @example
   * myWatcher.unwatchAll()
   */
  unwatchAll(): void {
    this.watcherCollection = {}
  }

  /**
   * Triggers a refresh.
   * * @example
   * myWatcher.refresh(42)
   */
  refresh(...args: A): void {
    const callbackStack = Object.values(this.watcherCollection)
    for (let i = 0; i < callbackStack.length; i++) {
      callbackStack[i](...args)
    }
  }

}
