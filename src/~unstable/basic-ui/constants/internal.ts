import { createTokens } from '../_internals/create-tokens'
import { BasicUIFlow, BasicUIPosition } from '../abstractions'

export const [KEY_TINT, __TINT, TOKEN_TINT] = createTokens('tint')
export const [KEY_TINT_40, __TINT_40, TOKEN_TINT_40] = createTokens('tint40')
export const [KEY_TINT_HOVER, __TINT_HOVER, TOKEN_TINT_HOVER] = createTokens('tintHover')
export const [KEY_SIZE, __SIZE, TOKEN_SIZE] = createTokens('size')

export const BASIC_UI_POSITION_START: BasicUIPosition = 'start'
export const BASIC_UI_POSITION_END: BasicUIPosition = 'end'
export const BASIC_UI_FLOW_ROW: BasicUIFlow = 'row'
export const BASIC_UI_FLOW_COLUMN: BasicUIFlow = 'column'
