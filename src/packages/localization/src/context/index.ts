import {
  createRef,
  IDisposable,
  LenientString,
  removeDuplicates,
} from '@glyph-cat/swiss-army-knife'
import { ReadOnlyStateManager, StateManager, StateManagerOptions } from 'cotton-box'
import { IDictionaryData, Language, LocalizationKey, LocalizedValue } from '../abstractions'
import { LocalizationDictionary } from '../dictionary'
import { LanguageNotFoundError, LocalizationKeyNotFoundError } from '../errors'

/**
 * @public
 */
export interface ILocalizationContextState<Dictionary extends IDictionaryData> {
  language: Language<Dictionary>
  auto: boolean
}

/**
 * @public
 */
export class LocalizationContext<Dictionary extends IDictionaryData> implements IDisposable {

  /**
   * A slightly altered list of language where the current language is excluded
   * and the default language is always the first element in the list.
   * This is meant to be used in the fallback section of {@link localize} only.
   * @internal
   */
  M$fallbackLanguageList: Array<Language<Dictionary>>

  /**
   * @internal
   */
  private readonly M$state: StateManager<ILocalizationContextState<Dictionary>>
  get state(): ReadOnlyStateManager<ILocalizationContextState<Dictionary>> {
    return this.M$state
  }

  /**
   * An alias for `.state.get().language`.
   */
  get currentLanguage(): Language<Dictionary> {
    return this.M$state.get().language
  }

  constructor(
    readonly dictionary: LocalizationDictionary<Dictionary>,
    readonly defaultLanguage: Language<Dictionary>,
    readonly defaultAuto: boolean = false,
    stageManagerOptions?: StateManagerOptions<ILocalizationContextState<Dictionary>>
  ) {
    this.M$state = new StateManager<ILocalizationContextState<Dictionary>>({
      language: defaultAuto
        ? dictionary.resolveLanguage(defaultLanguage)
        : defaultLanguage,
      auto: defaultAuto,
    }, stageManagerOptions)
    this.M$buildFallbackLanguageList()
    this.setLanguage = this.setLanguage.bind(this)
    this.trySetLanguage = this.trySetLanguage.bind(this)
    this.autoSetLanguage = this.autoSetLanguage.bind(this)
    this.localize = this.localize.bind(this)
    this.dispose = this.dispose.bind(this)
  }

  /**
   * @internal
   */
  private M$buildFallbackLanguageList(): void {
    this.M$fallbackLanguageList = removeDuplicates([this.defaultLanguage, ...this.dictionary.languages].filter((language) => language !== this.currentLanguage))
  }

  /**
   * Sets the language.
   *
   * @throws {@link LanguageNotFoundError}
   * if the target language does not exist in the dictionary.
   *
   * @param language - The target language.
   */
  setLanguage(language: Language<Dictionary>): void {
    if (this.dictionary.languages.has(language)) {
      this.M$state.set({ language, auto: false })
      this.M$buildFallbackLanguageList()
    } else {
      throw new LanguageNotFoundError(String(language))
    }
  }

  /**
   * Tries to set the language, does not throw an error if the target language
   * does not exist in the dictionary.
   * @param language - The target language.
   * @returns `true` if the attempt was successful, otherwise `false`.
   */
  trySetLanguage(language: LenientString<Language<Dictionary>>): boolean {
    if (this.dictionary.languages.has(language)) {
      this.M$state.set({ language, auto: false })
      this.M$buildFallbackLanguageList()
      return true
    } else {
      return false
    }
  }

  /**
   * Sets the closest matching language in the dictionary based on the list of
   * user-preferred languages.
   */
  autoSetLanguage(...clientLanguages: Array<string>): Language<Dictionary> {
    const resolvedLanguage = this.dictionary.resolveLanguage(...clientLanguages)
    this.M$state.set({
      auto: true,
      language: resolvedLanguage,
    })
    this.M$buildFallbackLanguageList()
    return resolvedLanguage
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
  localize(key: LocalizationKey<Dictionary>): LocalizedValue<Dictionary> {
    const valueRef = createRef<LocalizedValue<Dictionary>>(null)
    if (this.dictionary.tryLocalize(this.currentLanguage, key, valueRef)) {
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

  /**
   * Disposes the current context. Calling this method is not necessary when
   * created as a global variable, which should be most of the cases.
   */
  dispose(): void {
    this.M$state.dispose()
  }

}
