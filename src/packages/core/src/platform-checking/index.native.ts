import { UnsupportedPlatformError } from '@glyph-cat/foundation'

/**
 * @public
 */
export function checkIsApplePlatform(): boolean {
  // TODO: This should actually be possible if we tap into some React Native APIs
  throw new UnsupportedPlatformError()
}
