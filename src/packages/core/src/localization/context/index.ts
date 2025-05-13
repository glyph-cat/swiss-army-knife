import { ReadOnlyStateManager, StateManager, StateManagerOptions } from 'cotton-box'
import { RefObject } from '../../data'
import { IDisposable, LenientString } from '../../types'
import { IDictionary, Language, LocalizationKey, LocalizedValue } from '../abstractions'
import { LocalizationDictionary } from '../dictionary'
import { LanguageNotFoundError } from '../errors'

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
  private readonly _state: StateManager<ILocalizationContextState<Dictionary>>
  get state(): ReadOnlyStateManager<ILocalizationContextState<Dictionary>> {
    return this._state
  }

  /**
   * An alias for `.state.get().language`.
   */
  get currentLanguage(): Language<Dictionary> {
    return this._state.get().language
  }

  constructor(
    readonly dictionary: LocalizationDictionary<Dictionary>,
    readonly defaultLanguage: Language<Dictionary>,
    readonly defaultAuto: boolean = false,
    stageManagerOptions?: StateManagerOptions<ILocalizationContextState<Dictionary>>
  ) {
    this._state = new StateManager<ILocalizationContextState<Dictionary>>({
      language: defaultAuto
        ? dictionary.resolveLanguage(defaultLanguage)
        : defaultLanguage,
      auto: defaultAuto,
    }, stageManagerOptions)
    this.setLanguage = this.setLanguage.bind(this)
    this.trySetLanguage = this.trySetLanguage.bind(this)
    this.autoSetLanguage = this.autoSetLanguage.bind(this)
    this.localize = this.localize.bind(this)
    this.tryLocalize = this.tryLocalize.bind(this)
    this.dispose = this.dispose.bind(this)
  }

  setLanguage(language: Language<Dictionary>): void {
    if (this.dictionary.languages.has(language)) {
      this._state.set({ language, auto: false })
    } else {
      throw new LanguageNotFoundError(String(language))
    }
  }

  trySetLanguage(language: LenientString<Language<Dictionary>>): boolean {
    if (this.dictionary.languages.has(language)) {
      this._state.set({ language, auto: false })
      return true
    } else {
      return false
    }
  }

  autoSetLanguage(...clientLanguages: Array<string>): Language<Dictionary> {
    const resolvedLanguage = this.dictionary.resolveLanguage(...clientLanguages)
    this._state.set({
      auto: true,
      language: resolvedLanguage,
    })
    return resolvedLanguage
  }

  localize(key: LocalizationKey<Dictionary>): LocalizedValue<Dictionary> {
    return this.dictionary.localize(this.currentLanguage, key)
  }

  tryLocalize(
    key: LenientString<LocalizationKey<Dictionary>>,
    valueRef: RefObject<LocalizedValue<Dictionary>>,
  ): boolean {
    return this.dictionary.tryLocalize(this.currentLanguage, key, valueRef)
  }

  dispose(): void {
    this._state.dispose()
  }

}
