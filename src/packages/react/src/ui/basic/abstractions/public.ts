import { LenientString } from '@glyph-cat/swiss-army-knife'

/**
 * @public
 */
export type BasicUISize = 'l' | 'm' | 's'

/**
 * @public
 */
export type BasicUIColor = 'primary' | 'info' | 'success' | 'warn' | 'error' | 'danger'

/**
 * This can be:
 * - Any value from {@link BasicUIColor}
 * - Hex string
 * - RGB string
 * - HSL string
 * @public
 */
export type CustomizableBasicUIColor = LenientString<BasicUIColor>

// KIV: <Popover> API uses something similar to `BasicUIFlow` and `BasicUIPosition`, careful of conflict and confusion

/**
 * @public
 */
export type BasicUIFlow = 'column' | 'row'

/**
 * @public
 */
export type BasicUIPosition = 'start' | 'end'

/**
 * @public
 */
export type BasicUILayout = 'vertical' | 'horizontal'
