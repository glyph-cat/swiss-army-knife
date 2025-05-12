import { ReadOnlyStateManager, StateManager, StateManagerOptions } from 'cotton-box'
import { hasProperty, RefObject } from '../data'
import { IDisposable, LenientString, PartialStringRecord } from '../types'

/**
 * @public
 */
export class LanguageNotFoundError extends Error {

  constructor(language: Language<IDictionary>) {
    super(`Language "${language}" could not be found in the dictionary`)
  }

}

/**
 * @public
 */
export class LocalizationKeyNotFoundError extends Error {

  constructor(key: LocalizationKey<IDictionary>, language: Language<IDictionary>) {
    super(`Localization key "${key}" could not be found in the dictionary for language "${language}"`)
  }

}

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

/**
 * @public
 */
export class LocalizationDictionary<Dictionary extends IDictionary> {

  static resolveLanguage<Dictionary extends IDictionary>(
    language: LenientString<Language<Dictionary>>,
    languages: Set<Language<Dictionary>> | ReadonlySet<Language<Dictionary>>,
  ): Language<Dictionary> {
    if (languages.has(language)) {
      return language // Early exit
    }
    const languageToCheckChunks = (language as string).toLowerCase().split(/[_-]/g)
    const availableLanguages = [...languages.values()]
    for (const availableLanguage of availableLanguages) {
      const availableLanguageChunks = (availableLanguage as string).toLowerCase().split(/[_-]/g)
      for (const availableLanguageChunk of availableLanguageChunks) {
        for (const languageToCheckChunk of languageToCheckChunks) {
          if (availableLanguageChunk === languageToCheckChunk) {
            return availableLanguage
          }
        }
      }
    }
    return availableLanguages[0]
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
      throw new LanguageNotFoundError(language as string)
    }
    if (!hasProperty(this.dictionary[language], key)) {
      throw new LocalizationKeyNotFoundError(key as string, language as string)
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

  resolveLanguage(language: LenientString<Language<Dictionary>>): Language<Dictionary> {
    return LocalizationDictionary.resolveLanguage(language, this.languages)
  }

}

/**
 * @public
 */
export interface ILocalizationContextState<Dictionary extends IDictionary> {
  language: Language<Dictionary>
  auto: boolean
}

/**
 * @public
 */
export class LocalizationContext<Dictionary extends IDictionary> implements IDisposable {

  /**
   * @internal
   */
  private _language: StateManager<Language<Dictionary>>
  get language(): ReadOnlyStateManager<Language<Dictionary>> { return this._language }

  /**
   * @internal
   */
  private readonly _state: StateManager<ILocalizationContextState<Dictionary>>
  get state(): StateManager<ILocalizationContextState<Dictionary>> { return this._state }

  constructor(
    readonly dictionary: LocalizationDictionary<Dictionary>,
    readonly defaultLanguage: Language<Dictionary>,
    readonly defaultAuto: boolean,
    readonly stageManagerOptions?: StateManagerOptions<ILocalizationContextState<Dictionary>>
  ) {
    this._state = new StateManager<ILocalizationContextState<Dictionary>>({
      language: defaultLanguage,
      auto: defaultAuto,
    }, stageManagerOptions)
    this._language = new StateManager(defaultAuto
      ? dictionary.resolveLanguage(defaultLanguage)
      : defaultLanguage
    )
    this._state.watch(({ language, auto }) => {
      this._language.set(auto ? dictionary.resolveLanguage(language) : language)
    })
    this.setLanguage = this.setLanguage.bind(this)
    this.trySetLanguage = this.trySetLanguage.bind(this)
    this.setAuto = this.setAuto.bind(this)
    this.localize = this.localize.bind(this)
    this.tryLocalize = this.tryLocalize.bind(this)
    this.dispose = this.dispose.bind(this)
  }

  setLanguage(language: Language<Dictionary>): void {
    if (this.dictionary.languages.has(language)) {
      this._state.set((prevState) => ({ ...prevState, language }))
    } else {
      throw new LanguageNotFoundError(String(language))
    }
  }

  trySetLanguage(language: LenientString<Language<Dictionary>>): boolean {
    if (this.dictionary.languages.has(language)) {
      this._state.set((prevState) => ({ ...prevState, language }))
      return true
    } else {
      return false
    }
  }

  setAuto(auto: boolean): void {
    this._state.set((prevState) => ({ ...prevState, auto }))
  }

  localize(key: LocalizationKey<Dictionary>): LocalizedValue<Dictionary> {
    return this.dictionary.localize(this._language.get(), key)
  }

  tryLocalize(
    key: LenientString<LocalizationKey<Dictionary>>,
    valueRef: RefObject<LocalizedValue<Dictionary>>,
  ): boolean {
    return this.dictionary.tryLocalize(this._language.get(), key, valueRef)
  }

  dispose(): void {
    this._language.dispose()
    this._state.dispose()
  }

}
