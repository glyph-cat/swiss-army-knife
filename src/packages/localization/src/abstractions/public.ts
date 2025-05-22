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
export type LocalizationKey<Dictionary extends IDictionaryData> = { [Key in keyof Dictionary]: Dictionary[Key] extends object ? keyof Dictionary[Key] : never }[keyof Dictionary]

/**
 * @public
 */
export type LocalizedValue<Dictionary extends IDictionaryData> = Dictionary[Language<Dictionary>][LocalizationKey<Dictionary>]
