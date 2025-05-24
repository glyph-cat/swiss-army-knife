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
export type LocalizedValue<DictionaryData extends IDictionaryData> = DictionaryData[Language<DictionaryData>][keyof DictionaryData[Language<DictionaryData>]]
// NOTE: We cannot use `LocalizationKey` here, because when dictionary has incomplete localization values across different languages, trying to localize keys that are present in all languages would result in unknown type instead.
