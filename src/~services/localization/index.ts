import { LocalizationContext, LocalizationDictionary, } from '@glyph-cat/localization'
import { useLocalizationContext } from '@glyph-cat/localization-react'
import { devError, strictMerge } from '@glyph-cat/swiss-army-knife'
import { createStorageKey } from '~utils/app'

import en from './dictionary/en'
import zh from './dictionary/zh'

const STORAGE_KEY = createStorageKey('localization')

const dictionary = new LocalizationDictionary({ en, zh })

export const GlobalLocalizationContext = new LocalizationContext(dictionary, 'en', null, {
  lifecycle: typeof window === 'undefined' ? {} : {
    init({ commit, commitNoop, defaultState }) {
      const rawState = localStorage.getItem(STORAGE_KEY)
      if (rawState) {
        try {
          const parsedState = JSON.parse(rawState)
          commit(strictMerge(defaultState, parsedState))
          return // Early exit
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
})

export function useLocalization(): typeof GlobalLocalizationContext {
  return useLocalizationContext(GlobalLocalizationContext)
}
