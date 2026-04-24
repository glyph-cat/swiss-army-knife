import { PossiblyUndefined, TypedFunction } from '@glyph-cat/foundation'

/**
 * Only invoke the callback in client environment only.
 * @param callback - The callback to run in client only.
 * @returns The payload of the callback, if any.
 * @public
 */
export function clientOnly<F extends TypedFunction>(callback: F): PossiblyUndefined<ReturnType<F>> {
  if (typeof window !== 'undefined') {
    return callback()
  }
}
