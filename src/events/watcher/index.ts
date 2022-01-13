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
export interface Watcher<A extends Array<unknown>> {
  /**
   * Accepts a callback and start watching for changes. The callback will be
   * invoked whenever a refresh is triggered.
   */
  watch(callback: WatcherCallback<A>): UnwatchCallback
  /**
   * Forcecully remove all watchers.
   */
  unwatchAll(): void
  /**
   * Triggers a refresh.
   */
  refresh: WatcherCallback<A>
}

/**
 * Creates a Watcher.
 * @example
 * const watcher = createWatcher()
 * const unwatch = watcher.M$watch(() => { ... })
 * watcher.M$refresh(...) // Arguments can be passed
 * unwatch()
 * @returns A Watcher object.
 * @public
 */
export function createWatcher<A extends Array<unknown>>(): Watcher<A> {

  let watcherCollection: Record<number, CallableFunction> = {}
  let incrementalWatchId = 1

  const watch = (callback: WatcherCallback<A>): UnwatchCallback => {
    const newId = incrementalWatchId++
    watcherCollection[newId] = callback
    const unwatch = (): void => {
      delete watcherCollection[newId]
    }
    return unwatch
  }

  const unwatchAll = (): void => {
    watcherCollection = {}
  }

  const refresh = (...args: A): void => {
    const callbackStack = Object.values(watcherCollection)
    for (let i = 0; i < callbackStack.length; i++) {
      callbackStack[i](...args)
    }
  }

  return {
    watch,
    unwatchAll,
    refresh,
  }

}
