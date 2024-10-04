import { PartialRecord, StrictPropertyKey } from '../../types'

/**
 * Representation of a JavaScript object that helps to keep track
 * whether a property exists.
 * @public
 */
export type TruthMap<Key extends StrictPropertyKey = StrictPropertyKey> = PartialRecord<Key, true>

/**
 * Creates an object with properties specified in an array where all of their
 * values are `true`.
 * @param array - The list of keys.
 * @returns A mutable truth map.
 * @example
 * const truthMap = TruthMap(['a', 'b', 'c'])
 * // { a: true, b: true, c: true }
 * @public
 */
export function TruthMap<T extends StrictPropertyKey>(
  array: Array<T> | Readonly<Array<T>>
): Readonly<TruthMap<T>> {
  const obj = {} as TruthMap<T>
  for (const item of array) {
    obj[item as StrictPropertyKey] = true
  }
  return obj
}

/**
 * Read-only representation of a JavaScript object that helps to keep track
 * whether a property exists.
 * @public
 */
export type ReadonlyTruthMap<Key extends StrictPropertyKey = StrictPropertyKey> = Readonly<TruthMap<Key>>

/**
 * Creates an object with properties specified in an array where all of their
 * values are `true`.
 * @param array - The list of keys.
 * @returns A read-only truth map.
 * @example
 * const truthMap = ReadonlyTruthMap(['a', 'b', 'c'])
 * // { a: true, b: true, c: true }
 * @public
 */
export function ReadonlyTruthMap<T extends StrictPropertyKey>(
  array: Array<T> | Readonly<Array<T>>
): ReadonlyTruthMap<T> {
  return Object.freeze(TruthMap(array))
}

/**
 * Creates an object that allows resolving values in a reverse lookup strategy,
 * whereby multiple keys are allowed to have the same values.
 * @param sourceObject - An object where its key is the "value" to be resolved,
 * and the value is an array of "keys" that points to the "value".
 * @returns A mutable object with the keys and values populated accordingly.
 * @example
 * const multiKeyRecord = MultiKeyRecord({
 *   a: [1, 2],
 *   b: [3, 4],
 * })
 * // { 1: 'a', 2: 'a', 3: 'b', 4: 'b' }
 * @public
 */
export function MultiKeyRecord<Key extends StrictPropertyKey, Value extends StrictPropertyKey>(
  sourceObject: Record<Key, Array<Value>>
): Record<Value, Key> {
  const payload = {} as Record<Value, Key>
  for (const key in sourceObject) {
    for (const value of sourceObject[key]) {
      payload[value] = key
    }
  }
  return payload
}

/**
 * Creates an object that allows resolving values in a reverse lookup strategy,
 * whereby multiple keys are allowed to have the same values.
 * @param sourceObject - An object where its key is the "value" to be resolved,
 * and the value is an array of "keys" that points to the "value".
 * @returns A read-only object with the keys and values populated accordingly.
 * @example
 * const multiKeyRecord = ReadonlyMultiKeyRecord({
 *   a: [1, 2],
 *   b: [3, 4],
 * })
 * // { 1: 'a', 2: 'a', 3: 'b', 4: 'b' }
 * @public
 */
export function ReadonlyMultiKeyRecord<Key extends StrictPropertyKey, Value extends StrictPropertyKey>(
  sourceObject: Record<Key, Array<Value>>
): Readonly<Record<Value, Key>> {
  return Object.freeze(MultiKeyRecord(sourceObject))
}
