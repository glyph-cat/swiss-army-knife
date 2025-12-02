import { PossiblyUndefined } from '@glyph-cat/foundation'

/**
 * Organizes key-value pairs such that multiple different keys would eventually
 * resolve into a commonly shared value.
 * @public
 */
export class ConvergingDictionary<Key, Value> {

  private readonly expandedData: ReadonlyMap<Key, Value>

  constructor(data: Array<[keys: Array<Key>, value: Value]>) {
    const expandedData = new Map<Key, Value>()
    for (const item of data) {
      const [keys, value] = item
      for (const key of keys) {
        expandedData.set(key, value)
      }
    }
    this.expandedData = expandedData
  }

  resolve(key: Key): PossiblyUndefined<Value> {
    return this.expandedData.get(key)
  }

}
