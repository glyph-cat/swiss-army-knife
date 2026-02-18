import { BuildType, CleanupFunction, PossiblyUndefined, StringRecord } from '@glyph-cat/foundation'
import { pickLast } from '@glyph-cat/swiss-army-knife'
import { SimpleStateManager } from 'cotton-box'
import { createContext } from 'react'
import { BUILD_TYPE } from '../constants'

type InitializerDataPair<T> = [T, CleanupFunction]

class InitializerStoreQueue<T> {

  private readonly _array: Array<InitializerDataPair<T>> = []

  add(value: InitializerDataPair<T>): void {
    // console.log(`Pushing, length: ${this._array.length} + 1`)
    this._array.push(value)
  }

  shift(): PossiblyUndefined<InitializerDataPair<T>> {
    // console.log(`Shifting, length: ${this._array.length} - 1`)
    return this._array.shift()
  }

  getLast(): InitializerDataPair<T> {
    return pickLast(this._array)
  }

}

class InitializerStoreCollection<T> {

  private readonly _dict: StringRecord<InitializerStoreQueue<T>> = {}

  add(key: string, value: InitializerDataPair<T>): void {
    // console.log(`Accessing collection at key "${key}"`)
    if (!this._dict[key]) {
      this._dict[key] = new InitializerStoreQueue()
    }
    this._dict[key].add(value)
  }

  shift(key: string): PossiblyUndefined<InitializerDataPair<T>> {
    // console.log(`Shifting from collection at key "${key}"`)
    return this._dict[key].shift()
  }

  get(key: string): InitializerDataPair<T> {
    return this._dict[key].getLast()
  }

}

/**
 * @internal
 */
export class RuntimeManager {

  /**
   * @internal
   */
  M$initializerStore = new InitializerStoreCollection()

  /**
   * No need to wait in RN environment.
   * @internal
   */
  M$hydrationState = new SimpleStateManager(BUILD_TYPE === BuildType.RN)

}

/**
 * @internal
 */
export const RuntimeContext = createContext(new RuntimeManager())
