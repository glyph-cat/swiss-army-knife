import { PrecedenceLevel } from './public'

export const DATA_PRECEDENCE_LEVEL = 'data-precedence-level'

export const QUERY_SELECTOR_PRECEDENCE_LEVEL_INTERNAL = `style[${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.INTERNAL}"]`

export const QUERY_SELECTOR_PRECEDENCE_LEVEL_LOW = `style[${DATA_PRECEDENCE_LEVEL}="${PrecedenceLevel.LOW}"]`
