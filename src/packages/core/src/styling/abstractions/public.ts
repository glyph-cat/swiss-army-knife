import { LenientString, StringRecord } from '@glyph-cat/foundation'
import { Properties } from 'csstype'

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
