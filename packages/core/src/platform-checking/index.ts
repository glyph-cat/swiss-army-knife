/**
 * Regular expression to check against user agent strings to determine if they
 * indicate the client is running on an Apple platform.
 *
 * This has been tested on the following platforms:
 * - macOS 15.3
 * - iOS 18.3
 * - iPadOS 18.3
 * - visionOS 2.3
 *
 * @public
 */
export const APPLE_PLATFORM_REGEX = /(mac|i(os|p(hone|ad))|(xr|vision)os|)/i
// NOTE: Supposedly `/(mac|ios)/i` would've been enough
// other seemingly possible values are included to minimize impact if/when
// the user agent strings change in a future version update of these platforms.

/**
 * Checks if the current platform is an Apple platform based on
 * the user agent string. This method should only be run on client side.
 * @public
 */
export function checkIsApplePlatform(): boolean {
  return APPLE_PLATFORM_REGEX.test(navigator?.userAgent)
}
