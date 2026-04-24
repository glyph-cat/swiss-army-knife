import { UnsupportedPlatformError } from '@glyph-cat/foundation'

/**
 * @public
 */
export function useMediaQuery(
  query: string // eslint-disable-line @typescript-eslint/no-unused-vars
): boolean {
  throw new UnsupportedPlatformError()
}
