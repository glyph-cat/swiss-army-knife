import { Fn, IDisposable } from '@glyph-cat/foundation'

/**
 * @public
 */
export type WatcherCallback<A extends Array<unknown>> = Fn<A, void>

/**
 * @public
 */
export type UnwatchCallback = Fn

/**
 * @public
 * @example
 * const watcher = new Watcher<number>()
 */
export class Watcher<T> implements IDisposable {

  /**
   * @internal
   */
  private M$isDisposed = false

  /**
   * @internal
   */
  private M$watcherCollection = new Set<Fn<T>>()

  watch(callback: Fn<T>): () => void {
    this.M$watcherCollection.add(callback)
    return () => { this.M$watcherCollection.delete(callback) }
  }

  post(...args: T extends Array<unknown> ? T : [T]): void {
    if (this.M$isDisposed) { return } // Early exit
    this.M$watcherCollection.forEach((callback) => {
      (callback as Fn<Array<unknown>>)(...args)
    })
  }

  unwatchAll(): void {
    this.M$watcherCollection.clear()
  }

  dispose(): void {
    this.M$isDisposed = true
    this.unwatchAll()
  }

}
