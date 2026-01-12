import { BuildType } from '@glyph-cat/foundation'

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
