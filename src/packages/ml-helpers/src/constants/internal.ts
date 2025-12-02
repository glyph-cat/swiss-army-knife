/**
 * Is current execution environment based on package source code?
 * @internal
 */
export const IS_SOURCE_ENV = process.env.IS_SOURCE_ENV !== 'false'

/**
 * Is current execution target for a production bundle?
 * @internal
 */
export const IS_PRODUCTION_TARGET = process.env.IS_PRODUCTION_TARGET !== 'false'
