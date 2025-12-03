import { BuildType } from '@glyph-cat/foundation'
import { TimestampId } from '../datetime/timestamp-id'

/**
 * Git commit hash of which the package was built.
 * @public
 */
export const BUILD_HASH = process.env.PACKAGE_BUILD_HASH as string

/**
 * The package build type.
 * @public
 */
export const BUILD_TYPE = process.env.PACKAGE_BUILD_TYPE as BuildType

/**
 * The package version.
 * @public
 */
export const VERSION = process.env.PACKAGE_VERSION

/**
 * Refers to the non-production environment where this library is used by developers.
 * @public
 */
export const IS_DEBUG_ENV = process.env.NODE_ENV !== 'production'

/**
 * @public
 */
export const RUNTIME_ID = TimestampId()

/**
 * In React Native, the window is not exactly the same as what it is in the
 * browser. Even though it is accessible now, there's no guarantee it will stay
 * the same in the future. A more logical and transparent way is to create a
 * separate build for React Native where `IS_CLIENT_ENV` will always be true.
 * Here, it is also assumed that the internal debug environment runs on a client.
 *
 * NOTE: This should only be used to control the library's behavior in different
 * environments, NOT for checking whether browser APIs are available.
 *
 * @public
 */
export const IS_CLIENT_ENV = IS_DEBUG_ENV ||
  BUILD_TYPE === BuildType.RN ||
  typeof window !== 'undefined' // KIV: deprecate this?
// ^ NOTE: `typeof window !== 'undefined'` must be placed at the last because
// the value remains unknown at compile time, and will result in dead code not
// trimmed even when `IS_CLIENT_ENV` is undoubtedly true.
