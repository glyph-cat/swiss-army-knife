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

/**
 * - A replacement for `import { HAND_CONNECTIONS } from '@mediapipe/hands'`
 * - "TypeError: connections is not iterable" is thrown when trying to use it.
 * - No idea why the f••• it is `undefined`.
 * @public
 */
export const HAND_CONNECTIONS = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]] as Array<[start: number, end: number]>
