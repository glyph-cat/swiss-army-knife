import { Properties } from 'csstype'

/**
 * @public
 */
export type CSSProperties = Properties

/**
 * @public
 */
export type ExtendedCSSProperties = Properties & Record<string, Properties[keyof Properties]>
