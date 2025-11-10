import { isString } from '../type-check'

/**
 * Clone an object by stringifying then parsing it back into a JavaScript object.
 * @param obj - The object to be clones.
 * @returns The cloned object.
 * @public
 */
export function JSONclone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Tries to serialize an object with `JSON.stringify`, if it fails, will
 * fallback to `String(...)`.
 * @param value - The value to serialize
 * @returns A string representation of the object.
 * @public
 */
export function trySerializeJSON(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return String(value)
  }
}

/**
 * Tries to parse a string `JSON.parse`, will return `null` if it fails.
 * @param text - The string to parse.
 * @returns The parsed object.
 * @public
 */
export function tryParseJSON(
  text: string,
  reviver?: (key: string, value: unknown) => unknown,
): ReturnType<typeof JSON.parse> {
  if (!isString(text)) { return null }
  try {
    return JSON.parse(text, reviver)
  } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return null
  }
}
