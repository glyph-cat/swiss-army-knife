import { IDisposable, PartialRecord, StrictPropertyKey } from '@glyph-cat/foundation'

/**
 * @public
 */
export interface CustomEventListenerOptions {
  once?: boolean
}

/**
 * @public
 */
export class EventManager<Key extends StrictPropertyKey> implements IDisposable {

  /**
   * @internal
   */
  private M$isDisposed = false

  readonly listeners: PartialRecord<Key, Set<(...args: any[]) => void>> = {}

  addEventListener(
    key: Key,
    callback: (...args: any[]) => void,
    options?: CustomEventListenerOptions,
  ): void {
    if (this.M$isDisposed) { return } // Early exit
    if (!this.listeners[key]) {
      this.listeners[key] = new Set()
    }
    if (options?.once) {
      this.listeners[key].add((...args) => {
        callback(...args)
        this.removeEventListener(key, callback)
      })
    } else {
      this.listeners[key].add(callback)
    }
  }

  removeEventListener(
    key: Key,
    callback: (...args: any[]) => void,
  ): void {
    this.listeners[key]?.delete(callback)
  }

  post(key: Key, ...args: any[]): void {
    if (this.M$isDisposed) { return } // Early exit
    this.listeners[key]?.forEach((callback) => {
      callback(...args)
    })
  }

  dispose(): void {
    this.M$isDisposed = true
    for (const key in this.listeners) {
      delete this.listeners[key]
    }
  }

}
