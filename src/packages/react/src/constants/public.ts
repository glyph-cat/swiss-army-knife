/**
 * The available build types of the package.
 * @public
 */
export enum BuildType {
  /**
   * Common JS
   */
  CJS = 'CJS',
  /**
   * EcmaScript
   */
  ES = 'ES',
  /**
   * EcmaScript (minified)
   */
  MJS = 'MJS',
  /**
   * React Native
   */
  RN = 'RN',
  /**
   * Universal Module Definition
   */
  UMD = 'UMD',
  /**
   * Universal Module Definition (Minified)
   */
  UMD_MIN = 'UMD_MIN',
}

/**
 * The package's build type.
 * @public
 */
export const BUILD_TYPE = process.env.BUILD_TYPE as BuildType

/**
 * Hash of the Git commit in which the package's version is built.
 * @public
 */
export const BUILD_HASH = process.env.BUILD_HASH as string

/**
 * @public
 */
export const VERSION = process.env.PACKAGE_VERSION
