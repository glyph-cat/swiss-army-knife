import { StrictPropertyKey } from '../../types'

/**
 * @public
 */
export type TruthMapKey<T> = T | (number & {}) | (string & {})

/**
 * @public
 */
export type TruthMapCore<K extends StrictPropertyKey> = Partial<Record<TruthMapKey<K>, true>>

/**
 * Allows checking existence of a value in an array, with near 0(1) performance
 * by using object lookup under the hood. Once declared, the values cannot be
 * changed.
 * @public
 */
export class FixedTruthMap<K extends StrictPropertyKey> {

  /**
   * @internal
   */
  protected M$map: TruthMapCore<K>

  /**
   * @internal
   */
  private M$nonDuplicatedKeys: Array<TruthMapKey<K>>

  /**
   * @param keys - The values that will evaluate to be truthy when checking.
   * @example
   * const myFixedTruthMap = new FixedTruthMap(['foo', 'bar'])
   */
  constructor(keys: Array<TruthMapKey<K>>) {
    this.M$map = {}
    this.M$nonDuplicatedKeys = [...new Set(keys)]
    for (let i = 0; i < this.M$nonDuplicatedKeys.length; i++) {
      this.M$map[this.M$nonDuplicatedKeys[i]] = true
    }
  }

  /**
   * Retrieve all available keys.
   * @returns An array containing all the keys that exist in the TruthMap.
   * @example
   * let myTruthMap = new FixedTruthMap(['foo', 'bar']) // or DynamicTruthMap
   * myTruthMap.getKeys() // ['foo', 'bar']
   */
  getKeys(): Array<TruthMapKey<K>> {
    return [...this.M$nonDuplicatedKeys]
  }

  /**
   * Check if a value exists in the list.
   * @example
   * let myTruthMap = new FixedTruthMap(['foo', 'bar']) // or DynamicTruthMap
   * if (myTruthMap.has('foo')) {
   *   console.log('It contains "foo"!')
   * }
   */
  has(key: TruthMapKey<K>): boolean {
    return !!this.M$map[key] //  || false
  }

  /**
   * Get the underlying object.
   * @returns A JavaScript object representation of the TruthMap.
   * @example
   * let myTruthMap = new FixedTruthMap(['foo', 'bar']) // or DynamicTruthMap
   * myTruthMap.toJSON() // { foo: true, bar: true }
   */
  toJSON(): TruthMapCore<K> {
    return { ...this.M$map }
  }

}

/**
 * Allows checking existence of a value in an array with near 0(1) performance
 * by using object lookup under the hood. Values can be changed after
 * declaration.
 * @public
 */
export class DynamicTruthMap<K extends StrictPropertyKey> extends FixedTruthMap<K> {

  /**
   * @param keys - The values that will evaluate to be truthy when checking.
   * @example
   * let myDynamicTruthMap = new DynamicTruthMap()
   */
  constructor(keys: Array<TruthMapKey<K>> = []) {
    super(keys)
  }

  /**
   * Add an item.
   * @returns A new `DynamicTruthMap` instance with the item added.
   * @example
   * let myDynamicTruthMap = new DynamicTruthMap()
   * myDynamicTruthMap = myDynamicTruthMap.add('foo')
   */
  add<nK extends string | number>(newKey: nK): DynamicTruthMap<K | nK> {
    // nK = newKey
    const newKeyStack = this.getKeys()
    newKeyStack.push(newKey) // See footnote
    return new DynamicTruthMap(newKeyStack)
  }

  /**
   * Remove an item.
   * @returns A new `DynamicTruthMap` instance with the item removed.
   * @example
   * let myDynamicTruthMap = new DynamicTruthMap(['foo', 'bar'])
   * myDynamicTruthMap = myDynamicTruthMap.remove('foo')
   */
  remove<tK extends TruthMapKey<K>>(key: tK): DynamicTruthMap<Exclude<K, tK>> {
    // tK = targetKey
    const locallyDuplicatedMap = this.toJSON()
    delete locallyDuplicatedMap[key] // See footnote
    const newKeys = Object.keys(locallyDuplicatedMap)
    const newDynamicTruthMap = new DynamicTruthMap(newKeys)
    return newDynamicTruthMap as DynamicTruthMap<Exclude<K, tK>>
  }

}

// Footnote: Since the values are spreaded before being returned, we can push a
// new key into it without worrying the old instance would be affected.
