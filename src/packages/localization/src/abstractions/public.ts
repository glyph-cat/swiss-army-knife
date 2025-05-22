import { PartialStringRecord } from '@glyph-cat/swiss-army-knife'

/**
 * @public
 */
export type IDictionaryData = PartialStringRecord<PartialStringRecord>

/**
 * @public
 */
export type Language<Dictionary extends IDictionaryData> = keyof Dictionary

/**
 * @public
 */
export type LocalizationKey<Dictionary extends IDictionaryData> = keyof Dictionary[Language<Dictionary>]

/**
 * @public
 */
export type LocalizedValue<Dictionary extends IDictionaryData> = Dictionary[Language<Dictionary>][LocalizationKey<Dictionary>]
