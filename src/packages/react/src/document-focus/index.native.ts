import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'

/**
 * @public
 */
export function useDocumentFocus(): boolean {
  throw new UnsupportedPlatformError()
}
