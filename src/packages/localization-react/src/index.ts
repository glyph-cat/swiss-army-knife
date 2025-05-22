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
export function useLocalizationContext<Dictionary extends IDictionaryData>(
  localizationContext: LocalizationContext<Dictionary>,
  active: boolean = true,
): LocalizationContext<Dictionary> {
  useSimpleStateValue(localizationContext.state, languageSelector, active)
  return localizationContext
}

function languageSelector(state: ILocalizationContextState<IDictionaryData>): Language<IDictionaryData> {
  return state.language
}
