import { devError, strictMerge } from '@glyph-cat/swiss-army-knife'
import { StateManager } from 'cotton-box'
import { createStorageKey } from '~utils/app'
import { IUserPreferences } from './abstractions'

const STORAGE_KEY = createStorageKey('user-preferences')

export const UserPreferencesState = new StateManager<IUserPreferences>({
  language: 'en',
}, {
  lifecycle: typeof window === 'undefined' ? {} : {
    init({ commit, commitNoop, defaultState }) {
      try {
        const retrievedState = localStorage.getItem(STORAGE_KEY)
        if (retrievedState) {
          const state = strictMerge(defaultState, JSON.parse(retrievedState) as IUserPreferences)
          commit(state)
        }
      } catch (e) {
        devError(e)
        commitNoop()
      }
    },
    didSet({ state }) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    },
    didReset() {
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
