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
 * @deprecated Please use TypeScript's built-in `Awaited` type instead,
 * which is available in TypeScript 4.5 and later. This now only exists as a
 * fallback for projects using older TypeScript versions.
 */
export type Awaited<T> = T extends PromiseLike<infer U>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? { 0: Awaited<U>, 1: U }[U extends PromiseLike<any> ? 0 : 1]
  : T
