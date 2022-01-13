import { DetailedHTMLProps, HTMLAttributes } from 'react'

/**
 * Valid data types that can be used as JavaScript object keys.
 * @public
 */
export type JSObjectKey = number | string | symbol

/**
 * Valid data types that can be used as JavaScript object keys, EXCLUDING symbols.
 * @public
 */
export type JSObjectKeyStrict = number | string

/**
 * A representation of a generic JavaScript object.
 * @public
 */
export type JSObject = Record<JSObjectKey, unknown>

/**
 * A representation of a generic JavaScript function.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JSFunction = (...args: Array<any>) => any

/**
 * A shorthand for `DetailedHTMLProps<HTMLAttributes<T>, T>` where T is the HTML
 * Element.
 * @public
 */
export type QuickHTMLProps<T> = DetailedHTMLProps<HTMLAttributes<T>, T>

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
