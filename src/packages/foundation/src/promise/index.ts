import { TypedFunction } from '../function'

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
  ? { 0: Awaited<U>, 1: U }[U extends PromiseLike<any> ? 0 : 1]
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
