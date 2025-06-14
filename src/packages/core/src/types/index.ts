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

/**
 * @public
 */
export type ReadonlyOrWritableArray<T> = Array<T> | ReadonlyArray<T>

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
export type CleanupFunction<T = unknown> = (object?: T) => void

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
export type Awaitable<T> = T | Promise<T>

/**
 * @public
 */
export type Voidable<T> = T | void

/**
 * @public
 */
export type PossiblyUndefined<T> = T | undefined

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
export type AwaitedReturnType<T extends TypedFunction> = Awaited<ReturnType<T>>

/**
 * @public
 */
export type Falsable<T> = T | false

/**
 * @public
 */
export interface IDisposable {
  dispose(): void
}

/**
 * @public
 */
export interface RectangularBoundary {
  height: number
  left: number
  top: number
  width: number
}
