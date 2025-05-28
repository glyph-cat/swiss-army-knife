import { Language, LocalizationDictionary, LocalizedDictionary } from '@glyph-cat/localization'
import { devError } from '@glyph-cat/swiss-army-knife'
import { StateManager } from 'cotton-box'
import { useStateValue } from 'cotton-box-react'
import { createContext, JSX, ReactNode, useContext, useMemo } from 'react'
import { createStorageKey } from '~utils/app'

import en from './dictionary/en'
import zh from './dictionary/zh'

const STORAGE_KEY = createStorageKey('localization')

export const GlobalDictionary = new LocalizationDictionary({ en, zh })

export const LocalizationState = new StateManager<Language<typeof GlobalDictionary.data>>('en',
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
