import { Nullable } from '../../data'
import {
  CustomEventListenerOptions,
  EventManager,
} from '../../events/event-manager'
import { IDisposable, StringRecord } from '../../types'

export class RuntimeStorage implements Storage, IDisposable {

  /**
   * @internal
   */
  private readonly _eventListeners = new EventManager<RuntimeStorage.Events>()

  /**
   * @internal
   */
  private _dataStore: StringRecord<string> = {}

  get length(): number {
    return Object.keys(this._dataStore).length
  }

  clear(): void {
    for (const key in this._dataStore) {
      delete this[key]
    }
    this._dataStore = {}
    this._eventListeners.post(RuntimeStorage.Events.CLEAR)
  }

  getItem(key: string): Nullable<string> {
    return this._dataStore[key] ?? null
  }

  key(index: number): Nullable<string> {
    return Object.keys(this._dataStore)[index] ?? null
  }

  removeItem(key: string): void {
    delete this._dataStore[key]
    delete this[key]
    this._eventListeners.post(RuntimeStorage.Events.REMOVE, key)
  }

  setItem(key: string, value: unknown): void {
    const serializedValue = JSON.stringify(value)
    this._dataStore[key] = serializedValue
    this[key] = serializedValue
    this._eventListeners.post(RuntimeStorage.Events.SET, key, serializedValue)
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
    this._eventListeners.addEventListener(event, callback, options)
  }

  removeEventListener(
    event: RuntimeStorage.Events,
    callback: (...args: any[]) => void,
  ): void {
    this._eventListeners.removeEventListener(event, callback)
  }

  dispose(): void {
    this._eventListeners.dispose()
  }

}

export namespace RuntimeStorage {

  export enum Events {
    SET = 'set',
    REMOVE = 'remove',
    CLEAR = 'clear',
  }

}
