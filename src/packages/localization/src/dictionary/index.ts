import { LenientString, RefObject } from '@glyph-cat/foundation'
import { hasProperty, LazyValue } from '@glyph-cat/swiss-army-knife'
import { IDictionaryData, Language, LocalizationKey, LocalizedValue } from '../abstractions'
import { LanguageNotFoundError, LocalizationKeyNotFoundError } from '../errors'

/**
 * @public
 */
export class LocalizationDictionary<DictionaryData extends IDictionaryData> {

  /**
   * Given a list of user-preferred languages, tries to gracefully resolve the
   * closest matching language from a list of available languages. If there are
   * no matches, the first item in `availableLanguages` is returned.
   */
  static resolveLanguage<DictionaryData extends IDictionaryData>(
    clientLanguages: Array<LenientString<Language<DictionaryData>>>,
    availableLanguages: Set<Language<DictionaryData>> | ReadonlySet<Language<DictionaryData>>,
  ): Language<DictionaryData> {
    const availableLanguagesAsArray = new LazyValue(() => [...availableLanguages])
    for (const clientLanguage of clientLanguages) {
      if (availableLanguages.has(clientLanguage)) {
        return clientLanguage // Early exit
      }
      const clientLanguageChunks = String(clientLanguage).toLowerCase().split(/[_-]/g)
      for (const availableLanguage of availableLanguagesAsArray.value) {
        // todo: [mid priority] cache the splits for availableLanguage outside of the loop
        const availableLanguageChunks = String(availableLanguage).toLowerCase().split(/[_-]/g)
        for (const availableLanguageChunk of availableLanguageChunks) {
          for (const languageToCheckChunk of clientLanguageChunks) {
            if (availableLanguageChunk === languageToCheckChunk) {
              return availableLanguage
            }
          }
        }
      }
    }
    return availableLanguagesAsArray.value[0]
  }

  /**
   * @internal
   */
  private readonly M$languages: ReadonlySet<Language<DictionaryData>>

  /**
   * The list of available languages.
   */
  get languages(): ReadonlySet<Language<DictionaryData>> { return this.M$languages }

  constructor(readonly data: DictionaryData) {
    this.M$languages = new Set(Object.keys(data))
    this.localize = this.localize.bind(this)
    this.tryLocalize = this.tryLocalize.bind(this)
    this.resolveLanguage = this.resolveLanguage.bind(this)
  }

  /**
   * Get a localized value, given the language and key.
   * @param language - The target language.
   * @param key - The localization key.
   *
   * @throws {@link LanguageNotFoundError}
   * if the language does not exist in the dictionary.
   *
   * @throws {@link LocalizationKeyNotFoundError}
   * if the localization key does not exist in the dictionary.
   *
   * @example
   * myDictionary.localize('en', 'HELLO')
   */
  localize(
    language: Language<DictionaryData>,
    key: LocalizationKey<DictionaryData>,
  ): LocalizedValue<DictionaryData> {
    if (!hasProperty(this.data, language)) {
      throw new LanguageNotFoundError(String(language))
    }
    if (!hasProperty(this.data[language], key)) {
      throw new LocalizationKeyNotFoundError(String(key), String(language))
    }
    return this.data[language]![key] as LocalizedValue<DictionaryData>
  }

  /**
   * Tries to get a localized value, given the language and key.
   * @param language - The target language.
   * @param key - The localization key.
   * @param valueRef - A {@link RefObject} which will be assigned the localization
   * value if it exists.
   * @returns `true` if the localized value exists, otherwise `false`.
   * @example
   * import { createRef } from '@glyph-cat/swiss-army-knife'
   *
   * const valueRef = createRef<string>(null)
   * myDictionary.tryLocalize('en', 'HELLO', valueRef)
   */
  tryLocalize(
    language: LenientString<Language<DictionaryData>>,
    key: LenientString<LocalizationKey<DictionaryData>>,
    valueRef: RefObject<LocalizedValue<DictionaryData>>
  ): boolean {
    if (hasProperty(this.data, language)) {
      if (hasProperty(this.data[language], key)) {
        valueRef.current = this.data[language]![key] as LocalizedValue<DictionaryData>
        return true
      }
    }
    return false
  }

  /**
   * Given a list of user-preferred languages, tries to gracefully resolve the
   * closest matching language from the list of available languages in this dictionary.
   */
  resolveLanguage(...languages: Array<LenientString<Language<DictionaryData>>>): Language<DictionaryData> {
    return LocalizationDictionary.resolveLanguage(languages, this.languages)
  }

}
