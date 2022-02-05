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
 * @example
 */
export class Watcher<A extends Array<unknown>> extends GCObject {

  private M$watcherCollection: Record<number, CallableFunction> = {}

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
    const unwatch = (): void => {
      delete this.M$watcherCollection[this.$id]
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

}
