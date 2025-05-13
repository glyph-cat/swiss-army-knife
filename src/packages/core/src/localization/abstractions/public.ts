import { PartialStringRecord } from '../../types'

/**
 * @public
 */
export type IDictionary = PartialStringRecord<PartialStringRecord>

/**
 * @public
 */
export type Language<Dictionary extends IDictionary> = keyof Dictionary

/**
 * @public
 */
export type LocalizationKey<Dictionary extends IDictionary> = keyof Dictionary[Language<Dictionary>]

/**
 * @public
 */
export type LocalizedValue<Dictionary extends IDictionary> = Dictionary[Language<Dictionary>][LocalizationKey<Dictionary>]
