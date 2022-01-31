import { JSObjectKeyStrict } from '../../types'
import { GCObject } from '../../bases'

/**
 * @public
 */
// Done on purpose
// eslint-disable-next-line @typescript-eslint/ban-types
export type TruthMapKey<T> = T | (number & {}) | (string & {})

/**
 * @public
 */
export type TruthMapCore<K extends JSObjectKeyStrict> = Partial<Record<TruthMapKey<K>, true>>

/**
 * Allows checking existence of a value in an array, but with 0(1) performance
 * by using object lookup under the hood. Once declared, the values cannot be
 * changed.
 * @public
 */
export class FixedTruthMap<K extends JSObjectKeyStrict> extends GCObject {

  protected map: TruthMapCore<K>
  private nonDuplicatedKeys: Array<TruthMapKey<K>>

  /**
   * @param keys - The values that will evaluate to be truthy when checking.
   * @example
   * const myFixedTruthMap = new FixedTruthMap(['foo', 'bar'])
   */
  constructor(keys: Array<TruthMapKey<K>>) {
    super()
    this.map = {}
    this.nonDuplicatedKeys = [...new Set(keys)]
    for (let i = 0; i < this.nonDuplicatedKeys.length; i++) {
      this.map[this.nonDuplicatedKeys[i]] = true
    }
  }

  /**
   * Retrieve all available keys.
   * @returns An array containing all the keys that exist in the TruthMap.
   * @example
   * let myFixedTruthMap = new FixedTruthMap(['foo', 'bar'])
   * myFixedTruthMap.getKeys() // ['foo', 'bar']
   */
  getKeys(): Array<TruthMapKey<K>> {
    return [...this.nonDuplicatedKeys]
  }

  /**
   * Check if a value exists in the list.
   * @example
   * let myFixedTruthMap = new FixedTruthMap(['foo', 'bar'])
   * if (myFixedTruthMap.has('foo')) {
   *   console.log('It contains "foo"!')
   * }
   */
  has(key: TruthMapKey<K>): boolean {
    return !!this.map[key] //  || false
  }

  /**
   * Get the underlying object.
   * @returns A JavaScript object representation of the TruthMap.
   * @example
   * let myFixedTruthMap = new FixedTruthMap(['foo', 'bar'])
   * myFixedTruthMap.toJSON() // { foo: true, bar: true }
   */
  toJSON(): TruthMapCore<K> {
    return { ...this.map }
  }

}

/**
 * Allows checking existence of a value in an array, but with 0(1) performance
 * by using object lookup under the hood. Values can be changed after
 * declaration.
 * @public
 */
export class DynamicTruthMap<K extends JSObjectKeyStrict> extends FixedTruthMap<K>{

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
    const newDynamicTruthMap = new DynamicTruthMap()
    newDynamicTruthMap.map = locallyDuplicatedMap
    return newDynamicTruthMap
  }

}

// Footnote: Since the values are spreaded before being returned, we can push a
// new key into it without worrying the old instance would be affected.
