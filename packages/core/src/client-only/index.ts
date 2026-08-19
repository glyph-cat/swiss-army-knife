import { Fn, PossiblyUndefined } from '@glyph-cat/foundation'

/**
 * Only invoke the callback in client environment only.
 * @param callback - The callback to run in client only.
 * @returns The payload of the callback, if any.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function clientOnly<F extends Fn<void, any>>(callback: F): PossiblyUndefined<ReturnType<F>> {
  if (typeof window !== 'undefined') {
    return callback()
  }
}
