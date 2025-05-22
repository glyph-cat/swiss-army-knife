import { PartialStringRecord } from '@glyph-cat/swiss-army-knife'

/**
 * @public
 */
export type IDictionaryData = PartialStringRecord<PartialStringRecord>

/**
 * @public
 */
export type Language<DictionaryData extends IDictionaryData> = keyof DictionaryData

/**
 * @public
 */
export type LocalizationKey<DictionaryData extends IDictionaryData> = { [Key in keyof DictionaryData]: DictionaryData[Key] extends object ? keyof DictionaryData[Key] : never }[keyof DictionaryData]

/**
 * @public
 */
export type LocalizedValue<DictionaryData extends IDictionaryData> = DictionaryData[Language<DictionaryData>][LocalizationKey<DictionaryData>]
