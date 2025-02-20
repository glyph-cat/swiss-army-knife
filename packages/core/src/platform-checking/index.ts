import { APPLE_PLATFORM_REGEX } from './constants/public'

/**
 * Checks if the current platform is an Apple platform based on
 * the user agent string. This method should only be run on client side.
 * @public
 */
export function checkIsApplePlatform(): boolean {
  return APPLE_PLATFORM_REGEX.test(navigator?.userAgent)
}

// #region Miscellaneous exports
export * from './constants/public'
// #endregion Miscellaneous exports
