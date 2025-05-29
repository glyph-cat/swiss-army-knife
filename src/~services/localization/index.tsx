import { Language, LocalizedDictionary } from '@glyph-cat/localization'
import { devError, Nullable } from '@glyph-cat/swiss-army-knife'
import { StateManager } from 'cotton-box'
import { useStateValue } from 'cotton-box-react'
import { createContext, JSX, ReactNode, useContext, useMemo } from 'react'
import { createStorageKey } from '~utils/app'
import { GlobalDictionary } from './dictionary'

const STORAGE_KEY = createStorageKey('localization')

export type ILocalizationState = Nullable<Language<typeof GlobalDictionary.data>>

export const LocalizationState = new StateManager<ILocalizationState>('en',
  {
    lifecycle: typeof window === 'undefined' ? {} : {
      init({ commit, commitNoop }) {
        const rawState = localStorage.getItem(STORAGE_KEY)
        if (rawState) {
          try {
            const parsedState = JSON.parse(rawState)
            if (GlobalDictionary.languages.has(parsedState)) {
              commit(parsedState)
              return // Early exit
            }
          } catch (e) {
            devError(e)
          }
        }
        commitNoop()
      },
      didSet({ state }) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      },
      didReset() {
        localStorage.removeItem(STORAGE_KEY)
      },
    },
  }
)

const ReactLocalizationContext = createContext<LocalizedDictionary<typeof GlobalDictionary.data>>(null)

export interface LocalizationProviderProps {
  children?: ReactNode
}

export function LocalizationProvider({
  children,
}: LocalizationProviderProps): JSX.Element {
  const language = useStateValue(LocalizationState)
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
