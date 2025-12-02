import { IDisposable, Nullable, StringRecord } from '@glyph-cat/foundation'
import {
  CustomEventListenerOptions,
  EventManager,
} from '../../events/event-manager'

export class RuntimeStorage implements Storage, IDisposable {

  /**
   * @internal
   */
  private readonly M$eventListeners = new EventManager<RuntimeStorage.Events>()

  /**
   * @internal
   */
  private M$dataStore: StringRecord<string> = {}

  get length(): number {
    return Object.keys(this.M$dataStore).length
  }

  clear(): void {
    for (const key in this.M$dataStore) {
      delete this[key]
    }
    this.M$dataStore = {}
    this.M$eventListeners.post(RuntimeStorage.Events.CLEAR)
  }

  getItem(key: string): Nullable<string> {
    return this.M$dataStore[key] ?? null
  }

  key(index: number): Nullable<string> {
    return Object.keys(this.M$dataStore)[index] ?? null
  }

  removeItem(key: string): void {
    delete this.M$dataStore[key]
    delete this[key]
    this.M$eventListeners.post(RuntimeStorage.Events.REMOVE, key)
  }

  setItem(key: string, value: unknown): void {
    const serializedValue = JSON.stringify(value)
    this.M$dataStore[key] = serializedValue
    this[key] = serializedValue
    this.M$eventListeners.post(RuntimeStorage.Events.SET, key, serializedValue)
  }

  [key: string]: unknown

  addEventListener(
    event: RuntimeStorage.Events.SET,
    callback: (key: string, value: string) => void,
    options?: CustomEventListenerOptions,
  ): void

  addEventListener(
    event: RuntimeStorage.Events.REMOVE,
    callback: (key: string) => void,
    options?: CustomEventListenerOptions,
  ): void

  addEventListener(
    event: RuntimeStorage.Events.CLEAR,
    callback: () => void,
    options?: CustomEventListenerOptions,
  ): void

  /**
   * @internal
   */
  addEventListener(
    event: RuntimeStorage.Events,
    callback: (...args: any[]) => void,
    options?: CustomEventListenerOptions,
  ): void {
    this.M$eventListeners.addEventListener(event, callback, options)
  }

  removeEventListener(
    event: RuntimeStorage.Events,
    callback: (...args: any[]) => void,
  ): void {
    this.M$eventListeners.removeEventListener(event, callback)
  }

  dispose(): void {
    this.M$eventListeners.dispose()
  }

}

export namespace RuntimeStorage {

  export enum Events {
    SET = 'set',
    REMOVE = 'remove',
    CLEAR = 'clear',
  }

}
