import { UnsupportedPlatformError } from '@glyph-cat/foundation'

/**
 * @public
 */
export function useDocumentFocus(): boolean {
  throw new UnsupportedPlatformError()
}
