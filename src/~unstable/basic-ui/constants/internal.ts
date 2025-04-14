import { createTokens } from '../_internals/create-tokens'
import { BasicUIFlow, BasicUIPosition } from '../abstractions'

export const [__TINT, TOKEN_TINT] = createTokens('tint')
export const [__TINT_40, TOKEN_TINT_40] = createTokens('tint40')
export const [__TINT_STRONGER, TOKEN_TINT_STRONGER] = createTokens('tintStronger')
export const [__SIZE, TOKEN_SIZE] = createTokens('size')

// #region Bar-styled components

export const [
  __DIRECTION_MULTIPLIER,
  TOKEN_DIRECTION_MULTIPLIER,
] = createTokens('directionMultiplier')

export const [
  __CONTAINER_BORDER_RADIUS,
  TOKEN_CONTAINER_BORDER_RADIUS,
] = createTokens('containerBorderRadius')

export const [
  __FILL_BORDER_RADIUS,
  TOKEN_FILL_BORDER_RADIUS,
] = createTokens('fillBorderRadius')

// #endregion Bar-styled components

export const BASIC_UI_POSITION_START: BasicUIPosition = 'start'
export const BASIC_UI_POSITION_END: BasicUIPosition = 'end'
export const BASIC_UI_FLOW_ROW: BasicUIFlow = 'row'
export const BASIC_UI_FLOW_COLUMN: BasicUIFlow = 'column'
