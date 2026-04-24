/**
 * Valid data types that can be used as JavaScript object keys, EXCLUDING symbols.
 * @public
 */
export type StrictPropertyKey = number | string

/**
 * Representation of a JavaScript object where the key can be either
 * a number, string, or symbol.
 * @public
 */
export type PlainRecord<T = unknown> = Record<PropertyKey, T>

/**
 * Representation of a JavaScript object where the key can only be either
 * string or number.
 * @public
 */
export type StrictRecord<T = unknown> = Record<StrictPropertyKey, T>

/**
 * @public
 */
export type PartialStringRecord<T = unknown> = Partial<StringRecord<T>>

/**
 * Representation of a JavaScript object where the key can only be a number.
 * @public
 */
export type NumericRecord<T = unknown> = Record<number, T>

/**
 * Representation of a JavaScript object where the key can only be a string.
 * @public
 */
export type StringRecord<T = unknown> = Record<string, T>

/**
 * An shorthand for `Partial<Record<Key, Value>>`.
 * @public
 */
export type PartialRecord<Key extends PropertyKey, Value> = Partial<Record<Key, Value>>
