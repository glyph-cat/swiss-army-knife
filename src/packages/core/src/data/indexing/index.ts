import { PartialRecord, StrictPropertyKey } from '../../types'

/**
 * Representation of a JavaScript object that helps to keep track
 * whether a property exists.
 * @public
 */
export type TruthRecord<Key extends StrictPropertyKey = StrictPropertyKey> = PartialRecord<Key, true>

/**
 * Creates an object with properties specified in an array where all of their
 * values are `true`.
 * @param array - The list of keys.
 * @returns A mutable truth record.
 * @example
 * const truthRecord = TruthRecord(['a', 'b', 'c'])
 * // { a: true, b: true, c: true }
 * @public
 */
export function TruthRecord<T extends StrictPropertyKey>(
  array: Array<T> | Readonly<Array<T>>
): Readonly<TruthRecord<T>> {
  const obj = {} as TruthRecord<T>
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
export type ReadonlyTruthRecord<Key extends StrictPropertyKey = StrictPropertyKey> = Readonly<TruthRecord<Key>>

/**
 * Creates an object with properties specified in an array where all of their
 * values are `true`.
 * @param array - The list of keys.
 * @returns A read-only truth record.
 * @example
 * const truthRecord = ReadonlyTruthRecord(['a', 'b', 'c'])
 * // { a: true, b: true, c: true }
 * @public
 */
export function ReadonlyTruthRecord<T extends StrictPropertyKey>(
  array: Array<T> | Readonly<Array<T>>
): ReadonlyTruthRecord<T> {
  return Object.freeze(TruthRecord(array))
}
