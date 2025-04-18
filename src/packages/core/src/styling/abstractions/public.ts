import { Properties } from 'csstype'
import { LenientString, StringRecord } from '../../types'

/**
 * @public
 */
export type CSSProperties = Properties<LenientString<number>>

/**
 * @public
 */
export type ExtendedCSSProperties = CSSProperties & Record<string, CSSProperties[keyof CSSProperties]>

/**
 * @public
 */
export type CustomCSSVariablesRecord = StringRecord<ExtendedCSSProperties[keyof ExtendedCSSProperties]>
