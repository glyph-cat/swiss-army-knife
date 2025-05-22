import type {
  IDictionaryData,
  ILocalizationContextState,
  Language,
  LocalizationContext,
} from '@glyph-cat/localization'
import { useSimpleStateValue } from 'cotton-box-react'

/**
 * @param localizationContext - The {@link LocalizationContext|`LocalizationContext`} to use
 * @param active - Controls whether the hook should watch for state changes and
 * trigger component update. Defaults to `true`.
 * @public
 */
export function useLocalizationContext<DictionaryData extends IDictionaryData>(
  localizationContext: LocalizationContext<DictionaryData>,
  active: boolean = true,
): LocalizationContext<DictionaryData> {
  useSimpleStateValue(localizationContext.state, languageSelector, active)
  return localizationContext
}

function languageSelector(state: ILocalizationContextState<IDictionaryData>): Language<IDictionaryData> {
  return state.language
}
