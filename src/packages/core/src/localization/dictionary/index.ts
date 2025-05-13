import { hasProperty, LazyValue, RefObject } from '../../data'
import { LenientString } from '../../types'
import { IDictionary, Language, LocalizationKey, LocalizedValue } from '../abstractions'
import { LanguageNotFoundError, LocalizationKeyNotFoundError } from '../errors'

/**
 * @public
 */
export class LocalizationDictionary<Dictionary extends IDictionary> {

  static resolveLanguage<Dictionary extends IDictionary>(
    clientLanguages: Array<LenientString<Language<Dictionary>>>,
    availableLanguages: Set<Language<Dictionary>> | ReadonlySet<Language<Dictionary>>,
  ): Language<Dictionary> {
    const availableLanguagesAsArray = new LazyValue(() => [...availableLanguages.values()])
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
  private readonly _languages: ReadonlySet<Language<Dictionary>>
  get languages(): ReadonlySet<Language<Dictionary>> { return this._languages }

  constructor(readonly dictionary: Dictionary) {
    this._languages = new Set(Object.keys(dictionary))
    this.localize = this.localize.bind(this)
    this.tryLocalize = this.tryLocalize.bind(this)
    this.resolveLanguage = this.resolveLanguage.bind(this)
  }

  localize(
    language: Language<Dictionary>,
    key: LocalizationKey<Dictionary>,
  ): LocalizedValue<Dictionary> {
    if (!hasProperty(this.dictionary, language)) {
      throw new LanguageNotFoundError(String(language))
    }
    if (!hasProperty(this.dictionary[language], key)) {
      throw new LocalizationKeyNotFoundError(String(key), String(language))
    }
    return this.dictionary[language][key] as LocalizedValue<Dictionary>
  }

  tryLocalize(
    language: LenientString<Language<Dictionary>>,
    key: LenientString<LocalizationKey<Dictionary>>,
    valueRef: RefObject<LocalizedValue<Dictionary>>
  ): boolean {
    if (hasProperty(this.dictionary, language)) {
      if (hasProperty(this.dictionary[language], key)) {
        valueRef.current = this.dictionary[language][key]
        return true
      }
    }
    return false
  }

  resolveLanguage(...languages: Array<LenientString<Language<Dictionary>>>): Language<Dictionary> {
    return LocalizationDictionary.resolveLanguage(languages, this.languages)
  }

}
