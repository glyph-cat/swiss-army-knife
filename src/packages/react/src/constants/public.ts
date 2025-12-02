import { BuildType } from '@glyph-cat/foundation'

/**
 * The package's build type.
 * @public
 */
export const BUILD_TYPE = process.env.PACKAGE_BUILD_TYPE as BuildType

/**
 * Hash of the Git commit in which the package's version is built.
 * @public
 */
export const BUILD_HASH = process.env.PACKAGE_BUILD_HASH as string

/**
 * @public
 */
export const VERSION = process.env.PACKAGE_VERSION
