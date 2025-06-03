import { PossiblyUndefined } from '../../../types'

/**
 * Organizes key-value pairs such that multiple different values are traced back
 * to a common origin key.
 * @public
 */
export class ReverseDictionary<Key, Value> {

  private readonly reversedData: ReadonlyMap<Value, Key>

  constructor(data: Array<[key: Key, values: Array<Value>]>) {
    const reversedData = new Map<Value, Key>()
    for (const item of data) {
      const [key, values] = item
      for (const value of values) {
        reversedData.set(value, key)
      }
    }
    this.reversedData = reversedData
    this.resolve = this.resolve.bind(this)
  }

  resolve(value: Value): PossiblyUndefined<Key> {
    return this.reversedData.get(value)
  }

}
