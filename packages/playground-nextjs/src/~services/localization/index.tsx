import { Nullable } from '@glyph-cat/foundation'
import { Language, LocalizedDictionary } from '@glyph-cat/localization'
import { useStateValue } from 'cotton-box-react'
import { createContext, JSX, ReactNode, useContext, useMemo } from 'react'
import { UserPreferencesState } from '~services/user-preferences'
import { GlobalDictionary } from './dictionary'

export type ILocalizationState = Nullable<Language<typeof GlobalDictionary.data>>

// It is okay to throw a runtime error for this...
const ReactLocalizationContext = createContext<LocalizedDictionary<typeof GlobalDictionary.data>>(null!)

export interface LocalizationProviderProps {
  children?: ReactNode
}

export function LocalizationProvider({
  children,
}: LocalizationProviderProps): JSX.Element {
  const language = useStateValue(UserPreferencesState, (s) => s.language)
  const contextValue = useMemo(() => new LocalizedDictionary(GlobalDictionary, language), [language])
  return (
    <ReactLocalizationContext value={contextValue}>
      {children}
    </ReactLocalizationContext>
  )
}

export function useLocalization(): LocalizedDictionary<typeof GlobalDictionary.data> {
  return useContext(ReactLocalizationContext)
}

export * from './dictionary'
