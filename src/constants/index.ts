/**
 * Refers to the environment used to develop this library.
 * @internal
 */
export const IS_INTERNAL_DEBUG_ENV = process.env.IS_INTERNAL_DEBUG_ENV !== 'false'

/**
 * Refers to the non-production environment where this library is used by developers.
 * @public
 */
export const IS_DEBUG_ENV = process.env.NODE_ENV !== 'production'

/**
 * Refers to the build type of this library used.
 * Possible values:
 * * `cjs` - Common JS
 * * `es`  - EcmaScript
 * * `mjs` - EcmaScript (minified)
 * * `rn`  - React Native
 * @public
 */
export const LIB_BUILD_TYPE = process.env.BUILD_TYPE as (
  'cjs' | 'es' | 'mjs' | 'rn'
)

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
  LIB_BUILD_TYPE === 'rn' ||
  typeof window !== 'undefined'
// ^ NOTE: `typeof window !== 'undefined'` must be placed at the last because
// the value remains unknown at compile time, and will result in dead code not
// trimmed even when `IS_CLIENT_ENV` is undoubtedly true.

/**
 * @public
 */
export const VERSION = process.env.NPM_PACKAGE_VERSION
