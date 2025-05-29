import { createRef, removeDuplicates } from '@glyph-cat/swiss-army-knife'
import { IDictionaryData, Language, LocalizationKey, LocalizedValue } from '../abstractions'
import { LocalizationDictionary } from '../dictionary'
import { LocalizationKeyNotFoundError } from '../errors'

/**
 * @public
 */
export class LocalizedDictionary<DictionaryData extends IDictionaryData> {

  /**
   * A slightly altered list of language where the current language is excluded
   * and the default language is always the first element in the list.
   * This is meant to be used in the fallback section of {@link localize} only.
   * @internal
   */
  M$fallbackLanguageList: Array<Language<DictionaryData>>

  constructor(
    readonly dictionary: LocalizationDictionary<DictionaryData>,
    readonly language: Language<DictionaryData>,
  ) {
    this.M$fallbackLanguageList = removeDuplicates([
      this.language,
      ...this.dictionary.languages,
    ].filter((l) => l !== this.language))
    this.localize = this.localize.bind(this)
  }

  /**
   * Get a localized value, based on the current language, given the localization key.
   * If the localized value does not exist for current language, will fallback to
   * the localized value of the default language, then from other available languages
   * if it still fails.
   *
   * @throws {@link LocalizationKeyNotFoundError}
   * only when the localization key does not exist in the entire dictionary.
   *
   * @param key - The localization key.
   * @returns The localized value.
   */
  localize(key: LocalizationKey<DictionaryData>): LocalizedValue<DictionaryData> {
    const valueRef = createRef<LocalizedValue<DictionaryData>>(null)
    if (this.dictionary.tryLocalize(this.language, key, valueRef)) {
      return valueRef.current
    } else {
      for (const language of this.M$fallbackLanguageList) {
        if (this.dictionary.tryLocalize(language, key, valueRef)) {
          return valueRef.current
        }
      }
    }
    throw new LocalizationKeyNotFoundError(String(key))
  }

}
