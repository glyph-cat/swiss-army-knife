/* eslint-disable eqeqeq */

import { PrecedenceLevel } from '@glyph-cat/css-utils'

/**
 * Is current execution scope based on package source code?
 * @internal
 */
export const IS_SOURCE_ENV = process.env.IS_SOURCE_ENV != '0'

/**
 * Is current execution target for a production bundle?
 * @internal
 */
export const IS_PRODUCTION_TARGET = process.env.IS_PRODUCTION_TARGET != '0'

/**
 * @internal
 */
export const PRECEDENCE_LEVEL_INTERNAL = -1 as PrecedenceLevel
