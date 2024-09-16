/**
 * @public
 */
export type KeyValuePair<Key, Value> = [Key, Value]

/**
 * Valid data types that can be used as JavaScript object keys, EXCLUDING symbols.
 * @public
 */
export type StrictPropertyKey = number | string

/**
 * A representation of a generic JavaScript object.
 * @public
 * @deprecated Please use {@link PlainRecord} instead.
 */
export type JSObject = Record<PropertyKey, unknown>

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
 * Representation of a JavaScript object that helps to keep track whether
 * a property exists.
 * @public
 */
export type TruthRecord<Key extends StrictPropertyKey = StrictPropertyKey> = PartialRecord<Key, true>


/**
 * An shorthand for `Partial<Record<Key, Value>>`.
 * @public
 */
export type PartialRecord<Key extends PropertyKey, Value> = Partial<Record<Key, Value>>

/**
 * A representation of a generic JavaScript function.
 * @public
 * @deprecated Please use {@link TypedFunction} instead.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JSFunction = (...args: Array<any>) => any

/**
 * A representation of a generic JavaScript function with type inference.
 * @example
 * let getSum: TypedFunction<[a: number, b: number], number>
 * getSum = (a, b) => a + b
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypedFunction<Args extends any[] = any[], Payload = any> = (...args: Args) => Payload

/**
 * @public
 */
export type LenientString<T> = T | (string & {})

/**
 * @public
 */
export type NumericValues3 = [number, number, number]

/**
 * @public
 */
export type NumericValues4 = [number, number, number, number]

/**
 * @public
 */
export type RefObject<T> = { current: T }

/**
 * @public
 */
export type Awaitable<T> = T | Promise<T>

/**
 * @author Gerrit0
 * @see https://stackoverflow.com/a/49889856/5810737
 * @example
 * async function getString(): Promise<string> {
 *   return 'Hello, world!'
 * }
 * let myString: Awaited<Promise<string>>
 * myString = await getString()
 * @public
 */
export type Awaited<T> = T extends PromiseLike<infer U>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? { 0: Awaited<U>; 1: U }[U extends PromiseLike<any> ? 0 : 1]
  : T

/**
 * @example
 * async function getString(): Promise<string> {
 *   return 'Hello, world!'
 * }
 * let myString: AwaitedReturnType<typeof getString>
 * myString = await getString()
 * @public
 */
export type AwaitedReturnType<T extends JSFunction> = Awaited<ReturnType<T>>
