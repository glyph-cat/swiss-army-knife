import { useUnsupportedPlatformHandler } from '../../../__internals__'

/**
 * @public
 */
export function useMediaQuery(
  query: string // eslint-disable-line @typescript-eslint/no-unused-vars
): boolean {
  useUnsupportedPlatformHandler('Media query')
  return false
}
