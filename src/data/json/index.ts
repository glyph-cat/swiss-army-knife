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
 * Performs an equality check using `JSON.stringify`.
 * @param a - The first item to compare.
 * @param b - The second item to compare.
 * @returns A boolean indicating whether `a` and `b` evaluate to the same value.
 * @public
 */
export function isJSONequal(a: unknown, b: unknown): b is typeof a {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * Tries to serialize an object with `JSON.stringify`, if it fails, will
 * fallback to `String(...)`.
 * @param value - The value to serialize
 * @returns A string representation of the object.
 * @public
 */
export function trySerialize(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch (e) {
    return String(value)
  }
}
