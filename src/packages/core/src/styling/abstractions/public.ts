import { Properties } from 'csstype'
import { LenientString } from '../../types'

/**
 * @public
 */
export type CSSProperties = Properties<LenientString<number>>

/**
 * @public
 */
export type ExtendedCSSProperties = CSSProperties & Record<string, CSSProperties[keyof CSSProperties]>
