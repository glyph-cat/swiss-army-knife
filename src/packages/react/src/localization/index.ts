import {
  IDictionary,
  ILocalizationContextState,
  Language,
  LocalizationContext,
} from '@glyph-cat/swiss-army-knife'
import { useSimpleStateValue } from 'cotton-box-react'

/**
 * @param localizationContext - The {@link LocalizationContext|`LocalizationContext`} to use
 * @param active - Controls whether the hook should watch for state changes and
 * trigger component update. Defaults to `true`.
 * @public
 */
export function useLocalization<Dictionary extends IDictionary>(
  localizationContext: LocalizationContext<Dictionary>,
  active: boolean = true,
): LocalizationContext<Dictionary> {
  useSimpleStateValue(localizationContext.state, languageSelector, active)
  return localizationContext
}

function languageSelector(state: ILocalizationContextState<IDictionary>): Language<IDictionary> {
  return state.language
}
