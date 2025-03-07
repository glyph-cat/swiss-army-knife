import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'

/**
 * @public
 */
export function useMediaQuery(
  query: string // eslint-disable-line @typescript-eslint/no-unused-vars
): boolean {
  throw new UnsupportedPlatformError()
}
