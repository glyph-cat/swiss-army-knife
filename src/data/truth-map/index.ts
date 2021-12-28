/**
 * @public
 */
// Done on purpose
// eslint-disable-next-line @typescript-eslint/ban-types
export type TruthMapKey<T> = T | (number & {}) | (string & {})

/**
 * @public
 */
export type TruthMapCoreType<K extends number | string> = Partial<Record<TruthMapKey<K>, true>>

/**
 * @public
 */
export interface StaticTruthMap<K extends number | string> {
  /**
   * Retrieve all available keys.
   * @returns An array containing all the keys that exist in the TruthMap.
   */
  getKeys(): Array<TruthMapKey<K>>
  /**
   * Check if a value exists in the list.
   * @example
   * if (myTruthMap.has('key')) {
   *   // Do something
   * }
   */
  has(key: TruthMapKey<K>): boolean
  /**
   * Get the underlying object.
   * @returns A JavaScript object representation of the TruthMap.
   */
  toJSON(): TruthMapCoreType<K>
}

/**
 * @public
 */
export interface TruthMap<K extends number | string> extends StaticTruthMap<K> {
  /**
   * Add an item to the TruthMap.
   * @returns A new TruthMap with the item added.
   * The original TruthMap remains untouched.
   * @example
   * // ✅ Correct - because this allows immutability.
   * let myTruthMap = createTruthMap()
   * myTruthMap = myTruthMap.add('foo')
   * @example
   * // ❌ Wrong - it doesn't work like `array.push`.
   * const myTruthMap = createTruthMap()
   * myTruthMap.add('foo')
   */
  add<nK extends string | number>(newKey: nK): TruthMap<K | nK>
  /**
   * Remove an item to the TruthMap.
   * @returns A new TruthMap with the item removed.
   * The original TruthMap remains untouched.
   * @example
   * // ✅ Correct - because this allows immutability.
   * let myTruthMap = createTruthMap(['foo', 'bar'])
   * myTruthMap = myTruthMap.remove('foo')
   * @example
   * // ❌ Wrong - it doesn't work like `array.push`.
   * const myTruthMap = createTruthMap(['foo', 'bar'])
   * myTruthMap.remove('foo')
   */
  remove<tK extends TruthMapKey<K>>(key: tK): TruthMap<Exclude<K, tK>>
  /**
   * Removes everything from the TruthMap.
   * @returns A new empty TruthMap.
   * The original TruthMap remains untouched.
   * @example
   * // ✅ Correct - because this allows immutability.
   * let myTruthMap = createTruthMap(['foo', 'bar'])
   * myTruthMap = myTruthMap.clear()
   * @example
   * // ❌ Wrong - it doesn't work like `array.push`.
   * const myTruthMap = createTruthMap(['foo', 'bar'])
   * myTruthMap.clear()
   */
  clear(): TruthMap<K>
}

/**
 * Allows us to check if a value exists in an array, except by using object
 * lookup for O(1) performance. Once declared, the values cannot be changed
 * @param keys - The values that will evaluate to be truthy when checking.
 * @public
 */
export function createStaticTruthMap<K extends number | string>(
  keys: Array<TruthMapKey<K>>
): StaticTruthMap<K> {
  const map: TruthMapCoreType<K> = {}
  const nonDuplicatedKeys = [...new Set(keys)]
  for (let i = 0; i < nonDuplicatedKeys.length; i++) {
    map[nonDuplicatedKeys[i]] = true
  }
  return {
    getKeys(): Array<TruthMapKey<K>> {
      return nonDuplicatedKeys
    },
    has(key: TruthMapKey<K>): boolean {
      return map[key] || false
    },
    toJSON() {
      return { ...map }
    },
  }
}

/**
 * Serves the same purpose as `ConstantTruthMap`, but the values can still be
 * modified dynamically.
 * @param keys - The values that will evaluate to be truthy when checking.
 * @public
 */
export function createTruthMap<K extends number | string>(
  keys: Array<TruthMapKey<K>> = []
): TruthMap<K> {
  const baseMap = createStaticTruthMap(keys)
  return {
    ...baseMap,
    add<nK extends string | number>(newKey: nK): TruthMap<K | nK> {
      // nK = newKey
      return createTruthMap([...baseMap.getKeys(), newKey])
    },
    remove<tK extends TruthMapKey<K>>(key: tK): TruthMap<Exclude<K, tK>> {
      // tK = targetKey
      const locallyDuplicatedMap = baseMap.toJSON()
      delete locallyDuplicatedMap[key]
      return createTruthMap(Object.keys(locallyDuplicatedMap))
    },
    clear(): TruthMap<K> {
      return createTruthMap()
    },
  }
}
