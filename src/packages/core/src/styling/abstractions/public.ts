import { Properties } from 'csstype'
import { LenientString, StringRecord } from '../../types'

/**
 * @public
 */
export type CSSProperties = Properties<LenientString<number>>

/**
 * @public
 * @deprecated This type has been renamed to {@link CSSPropertiesExtended|`CSSPropertiesExtended`}.
 */
export type ExtendedCSSProperties = CSSPropertiesExtended

/**
 * @public
 */
export type CSSPropertiesExtended = CSSProperties & Record<string, CSSProperties[keyof CSSProperties]>

/**
 * @public
 */
export type CustomCSSVariablesRecord = StringRecord<CSSPropertiesExtended[keyof CSSPropertiesExtended]>
